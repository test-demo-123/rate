import * as i from './index';
import * as db from '../../helpers/db';
import * as knex from 'knex';


describe('server handlers index', () => {
    it('save posted record', async () => {
        const save = jest.spyOn(db, 'saveUser')
        save.mockResolvedValueOnce();
        await i.postRecordHandler({ body: 'first | last | f | red | 06/22/1980' } as any);
        expect(save).toHaveBeenCalled();
        save.mockRestore();
    });

    it('get user from line', () => {
        expect(i.parser('first | last | f | red | 06/22/1890' as any)).toEqual(expect.objectContaining({
            firstName: 'first',
            lastName: 'last',
            gender: 'F',
            favoriteColor: 'red',
            dob: expect.anything(),
        }))
    });

    it('should register handlers', () => {
        expect(i.handlers.length).toBeGreaterThan(0);
    });

    test.each(['gender','birthdate','name'])
    ('should use db on a search with type %s', async (sort) => {
        const mysql = knex.knex({ client: 'mysql2' })('t');
        const con = jest.spyOn(db, 'getCon');
        con.mockReturnValueOnce(mysql as any);
        i.getRecordsHandler({ pathParams: { sort } } as any);
        expect(con).toHaveBeenCalled();
        if (sort === 'gender') {
            expect(mysql.toString()).toContain('gender');
        }
        if (sort === 'birthdate') {
            expect(mysql.toString()).toContain('dob');
        }
        if (sort === 'name') {
            expect(mysql.toString()).toContain('firstName')
            expect(mysql.toString()).toContain('lastName')
        }
        con.mockRestore();
    });
})