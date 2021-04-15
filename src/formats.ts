import { PassThrough } from 'stream';
// const jsedn = require('jsedn');
import { toEDNStringFromSimpleObject } from 'edn-data';

type info = { isFirst: boolean, isLast: boolean }
const helper = (append: string, fn: (chunk: any, { isFirst, isLast }: info) => string, prepend: string) => {
    let seen = 0;
    let prev: any;
    return new PassThrough({
        objectMode: true,
        write(chunk, _, cb) {
            if (!seen) this.push(append);
            if (prev) this.push(fn(prev, { isFirst: !seen, isLast: false }));
            seen++
            prev = chunk;

            cb();
        },
        flush(cb) {
            if (prev) this.push(fn(prev, { isFirst: seen === 1, isLast: true }))
            this.push(prepend);
            this.push(null);
            cb();
        }
    })
}

export const json = () => helper(
    '[', (chunk, {isLast}) => {
        // last line in JSON should not have comma
        return '\n    ' + JSON.stringify(chunk) + (!isLast ? ',' : '')
    }, '\n]'
)

export const edn = () => helper(
    '[', (chunk) => {
        return '\n  ' + toEDNStringFromSimpleObject(chunk)}, '\n]'
)

export const csv = ({ delimiter = ',', header = true}) => helper(
    '', 
    (chunk, first) => {
        const headerRow = first && header ? Object.keys(chunk).join(delimiter) + '\n' : '';
        const row = Object.values(chunk).join(delimiter) + '\n';
        return `${headerRow}${row}`
    },
    ''
)