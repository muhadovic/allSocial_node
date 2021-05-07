import { check, validate, required } from '../../utils/validation/index';

export default [
    check('email')
        .custom(required)
        .isEmail()
        .withMessage('Invalid email address.')
        .trim()
        .customSanitizer((e) => e.toLowerCase()),

    validate,
];
