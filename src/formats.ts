import { PassThrough } from 'stream';
// const jsedn = require('jsedn');
import { toEDNStringFromSimpleObject } from 'edn-data';

type info = { isFirst: boolean, isLast: boolean }
export const helper = (append: string, fn: (chunk: any, { isFirst, isLast }: info) => string, concat: string) => {
    let seen = 0;
    let prev: string;
    
    return new PassThrough({
        readableObjectMode: false,
        writableObjectMode: true,
        write(chunk, _, cb) {
            if (!seen) this.push(append);

            if (prev) this.push(fn(prev, { isFirst: seen === 1, isLast: false }));
            seen++
            prev = chunk;

            cb();
        },
        flush(cb) {
            if (prev) this.push(fn(prev, { isFirst: seen === 1, isLast: true }))
            this.push(concat);
            this.push(null);
            cb();
        }
    })
}

export const json = () => helper(
    '[', (chunk, {isLast}) => {
        // last line in JSON should not have comma
        return `\n    ${JSON.stringify(chunk)}${(!isLast ? ',' : '')}`
    }, '\n]'
)

export const edn = () => helper(
    '[', (chunk) => {
        return '\n  ' + toEDNStringFromSimpleObject(chunk)}, '\n]'
)

export const csv = ({ delimiter = ', ', header = true}) => helper(
    '', 
    (chunk, { isFirst }) => {
        const headerRow = isFirst && header ? Object.keys(chunk).join(delimiter) + '\n' : '';
        const row = Object.values(chunk).join(delimiter) + '\n';
        return `${headerRow}${row}`
    },
    ''
)

export const getFormatter = (type: 'json'|'edn'|'csv' = 'json') => {
    if (type === 'json') return json();
    if (type === 'edn') return edn();
    if (type === 'csv') return csv({ delimiter: ', ', header: true });

    throw new Error(`unknown parser: ${type}`);
}