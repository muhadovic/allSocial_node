import { isMongoId, param, validate } from '../../utils/validation/index';

export default [param('profileId').custom(isMongoId), validate];
