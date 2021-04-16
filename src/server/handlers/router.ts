import { URL } from 'url';

import { IncomingMessage, ServerResponse } from 'http';
import { curry } from 'ramda';

interface iHandlerProps {
    searchParams: Record<string, string>,
    body: string|any,
    pathParams: Record<string, string|boolean|number>
}
type iPayloads = string|object|any[]|void;

export type iHandler = (props: iHandlerProps) => iPayloads|Promise<iPayloads>;

class param {
    constructor(public name: string, public type: BooleanConstructor|StringConstructor|NumberConstructor|string[]) {}
}
export const p = (name: string, type: BooleanConstructor|StringConstructor|NumberConstructor|string[] = String) => new param(name, type);

type methods = 'get'|'post'|'put'|'delete'|'patch'|'any';
export type iRoute = [
    methods, (string|param)[], iHandler
]

export const routeMatches = curry((method: methods, pathParts: string[], [routeMethod, path]: iRoute) => {
    if (path.length !== pathParts.length) return false;
    if (routeMethod !== 'any' && method !== routeMethod) return false;

    try {
        pathParts.forEach((part, idx) => {
            if (path[idx] !== part && path[idx] === 'string') {
                throw new Error;
            } else {
                const t = (<param>path[idx]).type;
                if (Array.isArray(t) && !t.includes(part)) {
                    throw new Error;
                }
            }
        });
        return true;
    } catch {
        return false;
    }
});

export const pathParams = ([, path]: iRoute, pathParts: string[]): Record<string, boolean|number|string> => {
    return pathParts.reduce((params, next, idx) => {
        if (!(path[idx] instanceof param)) return params;
        const p = (<param>path[idx]);
        return {
            ...params,
            [p.name]: Array.isArray(p.type) ? next : p.type(next)
        } 
    }, {});
}

export const getBody = async (req: IncomingMessage) => {
    let data = '';
    for await (const d of req) data = data.concat(d.toString('utf8'));

    const type = req.headers['content-type'];
    if (type?.includes('json')) {
        return JSON.parse(data);
    } else if (type?.includes('text')) {
        return data;
    } else {
        throw new Error('unsupported type');
    }
}

export const makeRouter = (...routes: iRoute[]) => async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(`http://localhost${req.url}`);

    const pathParts = url.pathname.replace(/^\//, '').replace(/[\/]{2,}/g, '/').split('/')
    const route = routes.find(routeMatches(req.method!.toLowerCase() as methods, pathParts))

    if (!route) {
        res.statusCode = 404;
        res.end('');
        return;
    }

    const response = await route[2]({
        body: await getBody(req),
        pathParams: pathParams(route, pathParts),
        searchParams: Object.fromEntries(url.searchParams.entries())
    });

    // todo: abstract response formatters
    res.statusCode = !response ? 204 : 200;
    res.setHeader('Content-Type', typeof response === 'string' ? 'text/plain' : 'application/json');
    res.end(typeof response === 'string' ? response : JSON.stringify(response, null, 4));

}