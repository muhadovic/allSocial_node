import { toInt, isInt } from 'validator';

export const sanitizeInt = ({ min = 0, max }) => {
    return (value, { path }) => {
        const formattedInt = toInt(value.toString()).toString();
        const range = max ? { min, max } : { min };

        if (!isInt(formattedInt, range)) {
            let message = `between ${min} and ${max}`;

            if (!max) {
                message = `greater than ${min}`;
            } else if (!min) {
                message = `less than than ${max}`;
            }

            throw new Error(`${path} must be an integer ${message}.`);
        }

        return parseFloat(value);
    };
};
