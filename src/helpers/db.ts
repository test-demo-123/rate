import * as knex from 'knex';
import { Writable } from 'stream';
import { iUserDetails } from '../data-mappers/user';
import { init } from './db-init';

export const connection = knex.knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: { filename: ':memory:' },
    pool: {
        destroyTimeoutMillis: 360000*1000,
        idleTimeoutMillis: 360000*1000,
        min: 1,
        max: 1,
    }
});

export const getCon = () => connection;

// init - this works due to only having 1 connection in the pool
// anything beside sqlite3 memory will need actual non demo initialization
init(connection);

export const saveUser = async (user: iUserDetails) => {
    await getCon().table('users').insert({
        ...user,
        dob: user.dob.toJSDate()
    });
}
