import jwt from 'express-jwt';

import { check, validate, required, length } from '../../utils/validation/index';

export default [
    jwt({ secret: process.env.JWT_SECRET }),
    check('password')
        .custom(required)
        .custom(length({ min: 6, max: 60 })),

    validate,
];
