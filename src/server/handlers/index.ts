import { pipe } from 'ramda';
import { reifyUser } from '../../data-mappers/user';
import { parseLine } from '../../helpers';
import { saveUser } from '../../helpers/db';
import { iHandler, iRoute, p } from './router';
import * as db from '../../helpers/db';

// find a place to dry this out to
export const parser = pipe(
    (x: string) => x,
    parseLine(['firstName', 'lastName', 'gender', 'favoriteColor', 'dob']),
    reifyUser
);

export const postRecordHandler: iHandler = ({body}) => {
    for (const user of body.split('\n').map(parser)) {
        saveUser(user);
    }
};

export const getRecordsHandler: iHandler = ({ pathParams: { sort } }) => {
    return db.getCon()
        .table('users')
        .modify(q => {
            if (sort === 'gender') q.orderBy('gender');
            if (sort === 'birthdate') q.orderBy('dob');
            if (sort === 'name') q.orderBy('lastName').orderBy('firstName');
        })
};

export const handlers: iRoute[] = [
    ['post', ['records'], postRecordHandler],
    ['get', ['records', p('sort', ['gender','birthdate','name'])], getRecordsHandler]
]