import { check, validate, isMongoId, required } from '../../utils/validation/index';

export default [
    check('reportedUser').custom(isMongoId),
    check('activityId').custom(required),
    check('type').custom(required),
    check('activityVerb').custom((value) => {
        if (value !== 'comment' && value !== 'post') throw new Error(`activityVerb can be only post|comment.`);
        return true;
    }),
    validate,
];
