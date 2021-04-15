import * as yargs from 'yargs';

const sortCols = ['gender', 'first', 'last', 'dob', 'favorite-color'];
export const args = yargs
    .option('s', {
        type: 'array',
        alias: 'sort',
        describe: 'sort the results by the provided col/direction in the order passed',
        choices: [
            ...sortCols,
            ...sortCols.map(c => `${c}:asc`),
            ...sortCols.map(c => `${c}:desc`)
        ]
    })
    .option('f', {
        type: 'string',
        alias: 'format',
        describe: 'out file format',
        choices: [ 'json', 'edn', 'csv' ]
    })
    .options('d', {
        type: 'string',
        alias: 'destination',
        describe: 'path of the file to write results into. stdout if not provided',
    })
    .option('p', {
        type: 'string',
        alisa: 'path',
        describe: 'path to file or files for processing',
    })
    .help('h').alias('h', 'help')
    .argv;