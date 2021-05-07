import {
    check,
    param,
    validate,
    isMongoId,
    match,
    twohat,
    length,
    unique,
    sanitizeInt,
    isAdmin,
} from '../../utils/validation/index';

export default [
    isAdmin,

    param('id').custom(isMongoId),

    check('name')
        .custom(length({ min: 3, max: 30 }))
        .custom(match)
        .custom(twohat)
        .optional(),

    check('username')
        .custom(length({ min: 3, max: 30 }))
        .custom(match)
        .custom(unique)
        .custom(twohat)
        .optional(),

    check('email')
        .isEmail()
        .withMessage('Invalid email address.')
        .custom(unique)
        .optional(),

    check('bio')
        .custom(twohat)
        .optional(),

    check('password')
        .custom(length({ min: 6, max: 60 }))
        .optional(),

    check('admin')
        .customSanitizer(sanitizeInt({ min: 0, max: 2 }))
        .optional(),

    check('flagged')
        .toBoolean()
        .optional(),

    validate,
];
