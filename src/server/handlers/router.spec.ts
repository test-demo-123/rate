import * as r from './router';

describe('router', () => {
    test.each([
        [`Boolean,`, Boolean],
        [`String,`, String],
        [`Number,`, Number],
        [`['test']`, ['test']],
    ])
    ('should produce a param class with p function', (name, type) => {
        const c = r.p(name, type as any);
        expect(c.name).toBe(name);
        if (typeof type === 'function') {
            expect((<any>c).type(1)).toEqual(expect.any(type))
        }
    });

    test.each([
        ['hello', 'text/plan', 'hello'],
        ['{"test": 1}', 'application/json', {test: 1}],
        ['something', 'application/nothing', new Error]
    ])('should get body from req', async (inArg, type, out) => {
        const req = {
            async* [Symbol.asyncIterator]() {
                yield inArg;
            },
            headers: {['content-type']: type}
        }

        if (out instanceof Error) {
            try {
                await r.getBody(req as any)
                fail('should throw instead')
            } catch {}
        } else {
            expect(await r.getBody(req as any)).toEqual(out);
        }
    });

    it('make path params', () => {
        const parsed = r.pathParams(<any>[, ['some', 'path', r.p('id', String)]], ['some', 'path', '123-4'])
        expect(parsed.id).toBe('123-4')
    })

    describe('router match', () => {
        it('should fail if paths not same length', () => {
            expect(r.routeMatches('get', [], <any>['get', ['one']])).toBeFalsy();
        });
        it('should fail if method is different', () => {
            expect(r.routeMatches('post', [], <any>['get', []])).toBeFalsy();
        });

        it('should return true for base route', () => {
            expect(r.routeMatches('get', [], <any>['get', []])).toBeTruthy();
        })
    })
})