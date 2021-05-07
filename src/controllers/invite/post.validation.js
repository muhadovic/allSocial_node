import { check, validate } from '../../utils/validation/index';

export default [
    check('emails')
        .isArray()
        .withMessage('emails must be an array.'),
    validate,
];
