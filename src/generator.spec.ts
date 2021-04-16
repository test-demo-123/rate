import * as gen from './generator'
import * as yargs from 'yargs';
describe('generator', () => {
    test.each([', ', ' | '])
    ('should generate a pipe separated row delimited by %s', (s) => {
        expect(gen.makeRow(s)().split(s).length).toBe(5);
    });

    it('get logger', () => {
        expect(gen.log).toBeInstanceOf(Function);
    });
})