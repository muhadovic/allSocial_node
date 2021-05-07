import { check, validate, sanitizeInt } from '../../utils/validation/index';

export default [
    check('limit')
        .customSanitizer(sanitizeInt({}))
        .optional(),

    check('offset')
        .customSanitizer(sanitizeInt({}))
        .optional(),
    check('type').custom((value) => {
        if (value !== 'following' && value !== 'followers')
            throw new Error(`Query "type" should be "followers" || "following".`);
        return true;
    }),

    validate,
];
