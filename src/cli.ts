import 'source-map-support/register';
import { reifyUser, userToStrs } from './data-mappers/user';
import {  parseLine, stdOut } from './helpers';
import { fromFiles as fromFileSystem, fromStdIn } from './helpers/line-sources';
import * as db from './helpers/db';
import { pipe, toString } from 'ramda';
import { createWriteStream } from 'fs';
import { args } from './cli-args';
import { Transform } from 'stream';
import { Writable } from 'stream';
import { promisify } from 'util';
import { pipeline as p} from 'stream';
const pipeline = promisify(p);
import { getFormatter } from './formats';
import { chain } from 'stream-chain';

export const parseSort = (s: any): [string, 'asc'|'desc'] => !s.includes(':')
    ? [s, 'asc']
    : s.split(':') as any;

export const userFromLine = pipe(
    (x: any) => x.toString('utf8'),
    parseLine(['firstName', 'lastName', 'gender', 'favoriteColor', 'dob']),
    reifyUser,
);

(async () => {

    const source = args.p ? fromFileSystem(args.p) : fromStdIn();
    const target = args.d ? createWriteStream(args.d) : stdOut();

    for await (const line of source) {
        await db.saveUser(userFromLine(line))
    }

    const sorts = args.s?.map(parseSort);
    const formatter = getFormatter(args.f as any);

    const users = db.getCon()
        .table('users')
        .modify(q => sorts?.forEach(([col, dir]) => q.orderBy(col, dir)))
        .stream();

    await pipeline(users, chain([userToStrs, formatter]), target);

    process.exit();
})().catch(e => {
    console.error(e);
    process.exit();
});

