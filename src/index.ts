import 'source-map-support/register';
import * as yargs from 'yargs';

const args = yargs
    .help('h').alias('h', 'help')
    .argv;

(async () => {
    console.log('hello');
    process.exit();
})();
