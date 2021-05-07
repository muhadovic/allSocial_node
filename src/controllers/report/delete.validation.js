import { check, validate, isMongoId, required } from '../../utils/validation/index';

export default [check('userId').custom(isMongoId), check('activityId').custom(required), validate];
