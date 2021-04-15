import { curryN, fromPairs, trim } from 'ramda';
import assert from 'assert';

export class UnparseableLine extends Error {}

export const parseLine = curryN(2, <T extends string>(cols: T[], line: string): Record<T, string|null> => {
    const parts = line.split(deduceDelimiter(line)!).map(trim);

    if (parts.length > cols.length) {
        throw new UnparseableLine(line);
    }

    return fromPairs(cols.map((c, idx) => [c, parts[idx] ?? null])) as any;
});

export const enforceDelimRule = <T extends string>(delims: T[]): T[] => {
    // prior delimiters should not be a subset of others
    delims.forEach((d, idx) => assert(delims.slice(idx + 1).every(d2 => !d2.includes(d))))
    return delims;
}

export const supportedDelimiters = enforceDelimRule([' | ', ', ', ' '])
export class UnknownDelimiter extends Error {}
export const deduceDelimiter = (line: string): typeof supportedDelimiters[number] | undefined => {
    return supportedDelimiters.find(d => line.includes(d));
}

export const noop = (...anything: any[]) => {};
