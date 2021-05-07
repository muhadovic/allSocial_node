import { check, validate, required } from '../../utils/validation/index';

export default [
    check('email')
        .custom(required)
        .trim()
        .customSanitizer((e) => e.toLowerCase()),

    check('password').custom(required),

    validate,
];
