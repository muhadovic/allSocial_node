import { check, validate, param, isMongoId, isModerator } from '../../utils/validation/index';

export default [
    isModerator,
    param('id').custom(isMongoId),
    check('ban')
        .toBoolean()
        .optional(),
    validate,
];
