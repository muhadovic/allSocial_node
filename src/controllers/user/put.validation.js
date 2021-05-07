import { check, twohat, length, match, unique, validate, isBoolean } from '../../utils/validation/index';

export default [
    check('name')
        .custom(length({ min: 3, max: 30 }))
        .custom(match)
        .custom(twohat)
        .optional(),

    check('username')
        .custom(length({ min: 3, max: 30 }))
        .custom(twohat)
        .custom(match)
        .custom(unique)
        .optional(),

    check('email')
        .isEmail()
        .withMessage('Invalid email address.')
        .custom(unique)
        .optional(),

    check('bio')
        .custom(twohat)
        .optional(),

    check('profileImage')
        .custom(twohat)
        .optional(),

    check('isPublic')
        .custom(isBoolean)
        .optional(),

    check('follow')
        .isArray()
        .withMessage('follow must be an array.')
        .optional(),

    check('interests')
        .isArray()
        .withMessage('interests must be an array.')
        .optional(),

    validate,
];
