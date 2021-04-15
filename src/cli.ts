import 'source-map-support/register';
import { reifyUser } from './data-mappers/user';
import {  parseLine } from './helpers';
import { fromFiles as fromFileSystem, fromStdIn } from './helpers/line-sources';
import * as db from './helpers/db';
import { pipe, toString } from 'ramda';
import { createWriteStream } from 'fs';
import { args } from './cli-args';

const parseSort = (s: any): [string, 'asc'|'desc'] => !s.includes(':')
    ? [s, 'asc']
    : s.split(':') as any;

const userFromLine = pipe(
    toString,
    parseLine(['firstName', 'lastName', 'gender', 'favoriteColor', 'dob']),
    reifyUser,
);

(async () => {

    console.info('starting processor');

    const source = args.p ? fromFileSystem(args.p) : fromStdIn();
    const target = args.d ? createWriteStream(args.d) : process.stdout;

    for await (const line of source) {
        await db.saveUser(userFromLine(line))
    }

    console.info('finished parsing');

    const sorts = args.s?.map(parseSort);

    db.getCon()
        .table('users')
        .modify(q => sorts?.forEach(([col, dir]) => q.orderBy(col, dir)))
        .stream()
        .pipe(target);


    console.info('finished processing');
    process.exit();
})();
