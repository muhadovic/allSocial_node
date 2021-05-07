import { check, validate, isMongoId } from '../../utils/validation/index';

const isoDateRegExp = new RegExp(
    /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,
);

export default [
    check('user_id').custom(isMongoId),
    check('unflag_at').custom((value) => {
        if (value && !isoDateRegExp.test(value))
            throw new Error('unflag_at is not in ISO-8601 standard: YYYY-MM-DDTHH:mm:ss.sssZ');

        return true;
    }),
    check('reason').optional(),
    validate,
];
