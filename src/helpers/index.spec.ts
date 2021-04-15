
import { range } from 'ramda';
import * as helpers from './';

function randomIntFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const randChars = (...anything: any[]) => {
    const randStr = Math.random().toString(36);
    const start = randomIntFromRange(0, randStr.length - 1);
    const end = randomIntFromRange(start + 1, randStr.length)
    const ret = randStr.slice(start, end);
    if (ret === '')
    console.log('\n'.repeat(10), { start, end, ret, randStr }, '\n'.repeat(10))
    return ret;
}

describe('helpers', () => {
    describe('parse line', () => {

        test.each([' | ', ', ', ' '])
        ('parseLine should parse with delimiter %s so?', (delimiter) => {
            const oneVal = randChars().split(delimiter).join('');
            const twoVal = randChars().split(delimiter).join('');

            const { one, two } = helpers.parseLine(['one', 'two'], `${oneVal}${delimiter}${twoVal}`);

            try {
                expect(one).toBe(oneVal);
                expect(two).toBe(twoVal);
            } catch (e) {
                expect({one, delimiter, oneVal, two, twoVal, deduced: helpers.deduceDelimiter('test')}).toBe('broken with better visibility')
            }
        });

        it('should have object even if cols are missing', () => {
            const obj = helpers.parseLine(['one', 'two', 'three'], '');

            expect(obj).toEqual(expect.objectContaining({
                one: '',
                two: null,
                three: null,
            }))
        });

        it('should fail to parse if it found more cols than i requested', () => {
            expect(() => helpers.parseLine(['a'], ['a', 'b', 'c'].join(helpers.supportedDelimiters[0]))).toThrow()
        })
    });

    describe('delimiter', () => {
        test.each(helpers.supportedDelimiters)
        ('should deduce correct delimiter for %s', (delimiter) => {
            for (const colLength of range(2, 20).concat([1])) {
                const line = range(0, colLength).map(() => 'somestringwithoutanydelims').join(delimiter);
                try {
                    expect(helpers.deduceDelimiter(line)).toBe(delimiter);
                } catch (e) {
                    expect(helpers.deduceDelimiter(line)).toBe(undefined)
                }
            }
        })

        it('should fail if delimiters are registered out of order', () => {
            expect(() => helpers.enforceDelimRule([' ', ' | '])).toThrowError()
        })

        it('should return list of delims passed in', () => {
            const delims = ['a', 'b', 'c']
            expect(helpers.enforceDelimRule(delims)).toBe(delims);
        })
    })

    describe('noop', () => {
        it('should not throw', () => {
            helpers.noop();
            helpers.noop({});
            helpers.noop(1,2,3);
        })
    });
});