import * as readline from 'readline';
import { createReadStream, lstatSync } from 'fs';
import g from 'glob';
import { promisify } from 'util';
import { PassThrough } from 'stream';

const glob = promisify(g);

export const fromFiles = (path: string): readline.Interface => lstatSync(path).isDirectory()
    ? folderStream(path)
    : readline.createInterface({ input: createReadStream(path) });

export const fromStdIn = () => readline.createInterface({ input: process.stdin });

export const folderStream = (path: string): readline.Interface => {
    const input = new PassThrough();
    (async () => {
        const files = await glob(`${path}/**`, { nodir: true });

        for (const p of files)
            for await (const l of fromFiles(p)) 
                input.push(l + '\n');

        input.push(null);
        input.destroy();
    })();

    return readline.createInterface({ input });;
};
