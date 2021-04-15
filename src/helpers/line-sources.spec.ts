import * as sources from './line-sources';
import * as fs from 'fs';
import * as readline from 'readline';
import { F } from 'ramda';

describe('stream', () => {
    it('from file should open up a strea to a file', () => {
        const res = sources.fromFiles('/dev/null');
        expect(res).toBeInstanceOf(readline.Interface);
    })

    it('should provide std in stream', () => {
        const stream = sources.fromStdIn();
        expect(stream).toBeInstanceOf(readline.Interface)
    });

    it('should pick folder stream if we are in a folder', async () => {
        await fs.promises.mkdir('/tmp/rate-demo/test2').catch(F);
        
        jest.spyOn(sources, 'folderStream').mockReturnValueOnce('folder-stream' as any);

        expect(sources.fromFiles('/tmp/rate-demo/test2')).toBe('folder-stream')
    });

    it('should stitch files together if dir is passed', async () => {
        await fs.promises.mkdir('/tmp/rate-demo/test1').catch(F);

        fs.writeFileSync(`/tmp/rate-demo/test1/test-file1`, 'test\ntest');
        fs.writeFileSync(`/tmp/rate-demo/test1/test-file2`, 'line\nline');

        const fileLines = sources.folderStream('/tmp/rate-demo/test1');

        const res = [];
        for await (const l of fileLines) res.push(l);

        expect(res).toEqual(['test', 'test', 'line', 'line']);
    })
})