import * as joi from 'joi';
import { DateTime } from "luxon";
import { evolve, pipe } from "ramda";

export interface iUserDetails {
    firstName: string,
    lastName: string,
    favoriteColor: string,
    gender: 'M'|'F',
    dob: DateTime
}

export const validateSchema = joi.object({
    firstName: joi.string().required().min(2),
    lastName: joi.string().required().min(2),
    favoriteColor: joi.string().required().min(2),
    gender: joi.string().allow('m', 'f', 'male', 'female'),
    dob: joi.date().less('now')
});

export const validateUserWithSchema = (obj: any) => joi.attempt(obj, validateSchema);

export const reifyUser = (data: Record<keyof iUserDetails, string>): iUserDetails => pipe(
    validateUserWithSchema,
    evolve({
        dob: DateTime.fromJSDate,
        gender: (g: string) => g.toLowerCase().includes('f') ? 'F' : 'M',
    })
)(data) as any;

export const userToStrs = (user: iUserDetails): Record<keyof iUserDetails, string> => ({
    ...user,
    dob: user.dob.toFormat('YYYY/MM/DD')
})