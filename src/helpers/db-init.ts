import * as knex from 'knex';
import { noop } from '.';

// db initializtion would normally not be done like this
// but it should suit for demo purposes
export const init = async (sql: knex.Knex) => {
    sql.raw(`
        CREATE TABLE users (
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            favoriteColor TEXT NOT NULL,
            gender text CHECK( gender IN ('M','F') ),
            dob TEXT NOT NULL
        )
    `).then(noop);
    ['firstName', 'lastName', 'favoriteColor', 'gender'].map(f => sql.raw(`CREATE INDEX idx_${f} ON users(${f});`).then(noop))
}