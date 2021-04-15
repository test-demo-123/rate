import * as db from './db';
import * as knex from 'knex';
import { DateTime } from 'luxon';

describe('db helpers', () => {
    it('should save a user', async () => {
        const con = knex.knex({ client: 'mysql2' })('t');

        jest.spyOn(db, 'getCon').mockReturnValueOnce(con as any)
        try {
            await db.saveUser({
                firstName: 'firstNameTest',
                lastName: 'testing',
                favoriteColor: 'green',
                gender: 'M',
                dob: DateTime.now(),
            })
        } catch (e) {
            expect(`${con}`).toContain('insert into `users`')
            expect(`${con}`).toContain('firstNameTest')
        }
    })

    it('should return query builder', () => {
        expect(db.getCon()?.table).toBeTruthy();
    })
})