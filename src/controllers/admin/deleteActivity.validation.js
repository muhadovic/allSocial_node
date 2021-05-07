import { validate, check, isMongoId, required } from '../../utils/validation/index';

export default [
    check('userId').custom(isMongoId),
    check('activityId').custom(required),
    check('activityVerb').custom((value) => {
        if (value !== 'comment' && value !== 'post') throw new Error(`activityVerb can be only post|comment.`);
        return true;
    }),
    validate,
];
