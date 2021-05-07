import { isLength } from 'validator';

export const length = ({ min = 0, max }) => {
    return (value, { path }) => {
        if (!isLength(value, { min, max })) {
            let message = `between ${min} and ${max}`;

            if (!max) {
                message = `greater than ${min}`;
            } else if (!min) {
                message = `less than than ${max}`;
            }

            throw new Error(`${path} must be ${message} characters.`);
        }

        return true;
    };
};
