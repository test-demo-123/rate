import * as cli from './cli';

describe('cli tests', () => {
    it('parse sort', () => {
        expect(cli.parseSort('order:asc')).toEqual(['order', 'asc']);
        expect(cli.parseSort('order')).toEqual(['order', 'asc']);
        expect(cli.parseSort('order:desc')).toEqual(['order', 'desc']);
    });

    it('get user from line', () => {
        expect(cli.userFromLine(Buffer.from('first | last | f | red | 06/22/1890'))).toEqual(expect.objectContaining({
            firstName: 'first',
            lastName: 'last',
            gender: 'F',
            favoriteColor: 'red',
            dob: expect.anything(),
        }))
    })
})