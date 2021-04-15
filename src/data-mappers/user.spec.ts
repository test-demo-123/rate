import { ValidationError } from 'joi';
import { DateTime } from 'luxon';
import * as user from './user';

describe('data-mapper', () => {
    const userStr: Record<keyof user.iUserDetails, string> = {
        firstName: 'testing',
        lastName: 'something',
        dob: '2016-01-01',
        favoriteColor: 'red',
        gender: 'male'
    };

    it('reifyUser should validate and reify input into user object', () => {
        expect(user.reifyUser(userStr)).toEqual(expect.objectContaining({
            firstName: userStr.firstName,
            lastName: userStr.lastName,
            dob: expect.any(DateTime),
            gender: 'M',
            favoriteColor: userStr.favoriteColor,
        }))

        expect(user.reifyUser({...userStr, gender: 'female'})).toEqual(expect.objectContaining({
            firstName: userStr.firstName,
            lastName: userStr.lastName,
            dob: expect.any(DateTime),
            gender: 'F',
            favoriteColor: userStr.favoriteColor,
        }))
    })

    it('should fail to refify a user from bad input', () => {
        expect(() => user.reifyUser({ ...userStr, firstName: '', lastName: ''})).toThrowError(ValidationError);
    });


})