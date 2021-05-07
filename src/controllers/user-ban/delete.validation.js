import { validate, isMongoId, param } from '../../utils/validation/index';

export default [param('userId').custom(isMongoId), validate];
