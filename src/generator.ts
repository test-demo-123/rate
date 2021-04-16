import * as yargs from 'yargs';
import { uniqueNamesGenerator,  colors, names } from 'unique-names-generator';
import { DateTime } from 'luxon';
import { unary } from 'ramda';
const bithDays = [...new Array(70*365)]
    .map((_, idx) => DateTime.now().minus({ days: idx }).toISODate());

export const log = unary(console.log);

export const getargs = () => yargs
    .option('l', {
        description: 'lines to generate',
        demandOption: 'l is required for lines to generate',
        type: 'number'
    })
    .option('s', {
        description: 'separator',
        type: 'string',
        default: ' | '
    }).argv;

export const makeRow = (separator: string) => () => {
    return uniqueNamesGenerator({
        dictionaries: [names, names, ['m', 'f'], colors, bithDays], 
        length: 5, 
        separator
    })
};

if (!process.env.JEST_WORKER_ID) {
    (async () => [...new Array(getargs().l)]
        .map(makeRow(getargs().s))
        .map(log)
    )();
}