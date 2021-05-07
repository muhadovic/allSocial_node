import { check, length, validate, required } from '../../utils/validation/index';

export default [
    check('current').custom(required),

    check('update')
        .custom(required)
        .custom(length({ min: 6, max: 60 })),

    validate,
];
