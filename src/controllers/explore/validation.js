import { check, validate, isMongoId, isAdmin } from '../../utils/validation/index';

export default [isAdmin, check('actorId').custom(isMongoId), check('foreignId'), check('time'), validate];
