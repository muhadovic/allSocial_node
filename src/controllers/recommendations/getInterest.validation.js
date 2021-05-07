import { query, required, validate } from '../../utils/validation/index';

export default [
    query('interest').custom(required),
    query('limit')
        .custom((limit) => {
            if (limit < 5 || limit > 20) throw new Error('limit should be between 5 and 20');
            return true;
        })
        .optional(),

    validate,
];
