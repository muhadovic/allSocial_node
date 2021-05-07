import { param, validate, required } from '../../utils/validation/index';

export default [param('feedId').custom(required), param('feedGroup').custom(required), validate];
