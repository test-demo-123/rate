import { PassThrough, Readable } from 'stream';
import * as f from './formats';
import { toEDNStringFromSimpleObject } from 'edn-data';



describe('formatters', () => {
    test.each(['json', 'edn', 'csv'])
    ('should get formatters for %s', (format: any) => {
        const formattter = jest.spyOn(f, format);
        f.getFormatter(format)
        formattter.mockRestore();
    });

    it('should throw with unknown formatter', () => {
        expect(() => f.getFormatter('nothing' as any)).toThrow();
    })

    it('should format json', (done) => {
        let data = '';
        const j = f.json();
        j.on('data', d => data += d.toString('utf8'));

        const read = new Readable({ objectMode: true, read() {} })
        
        read.pipe(j);
        read.push({test: 'one'})
        read.push({test: 'two'});
        read.push(null);
        read.destroy();

        j.on('end', () => {    
            expect(JSON.parse(data)).toEqual([
                {test: 'one'},
                {test: 'two'}
            ])
            done();
        })
    })
    it('should format edn', (done) => {
        let data = '';
        const formatter = f.edn();
        formatter.on('data', d => data += d.toString('utf8'));

        const read = new Readable({ objectMode: true, read() {} })
        
        read.pipe(formatter);
        read.push({test: 'one'})
        read.push({test: 'two'});
        read.push(null);
        read.destroy();

        formatter.on('end', () => {    
            expect(data).toContain('{:test "one"}');
            expect(data).toContain('{:test "two"}');

            done();
        })
    })

    it('should format csv', (done) => {
        let data = '';
        const formatter = f.csv({delimiter: ', ', header: true});
        formatter.on('data', d => data += d.toString('utf8'));

        const read = new Readable({ objectMode: true, read() {} })
        
        read.pipe(formatter);
        read.push({col1: 'one', col2: 'red'})
        read.push({col1: 'two', col2: 'blue'});
        read.push(null);
        read.destroy();

        formatter.on('end', () => {    
            expect(data).toBe('col1, col2\none, red\ntwo, blue\n');
            done();
        })
    })
});