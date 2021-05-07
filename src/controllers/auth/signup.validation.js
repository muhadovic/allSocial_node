import { check, validate, required, length, unique, twohat, match } from '../../utils/validation/index';

export default [
    check('name')
        .custom(required)
        .custom(length({ min: 3, max: 30 }))
        .custom(match)
        .custom(twohat),

    check('username')
        .custom(required)
        .custom(length({ min: 3, max: 30 }))
        .custom(match)
        .custom(twohat)
        .custom(unique),

    check('email')
        .custom(required)
        .isEmail()
        .withMessage('Invalid email address.')
        .custom(unique),

    check('password')
        .custom(required)
        .custom(length({ min: 6, max: 60 })),

    validate,
];
