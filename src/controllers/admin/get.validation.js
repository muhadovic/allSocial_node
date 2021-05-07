import { query, validate, isMongoId, isModerator, match, sanitizeInt } from '../../utils/validation/index';

export default [
    isModerator,

    query('_id')
        .custom(isMongoId)
        .optional(),

    query('verified')
        .toBoolean()
        .optional(),

    query('admin')
        .customSanitizer(sanitizeInt({ min: 1, max: 2 }))
        .optional(),

    query('flagged')
        .toBoolean()
        .optional(),

    query('createdAt')
        .custom(match)
        .optional(),

    query('updatedAt')
        .custom(match)
        .optional(),

    query('per_page')
        .customSanitizer(sanitizeInt({ min: 1, max: 50 }))
        .optional(),

    query('page')
        .customSanitizer(sanitizeInt({ min: 1 }))
        .optional(),

    validate,
];
