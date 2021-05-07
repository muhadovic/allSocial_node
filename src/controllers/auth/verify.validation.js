import { query, validate, required } from '../../utils/validation/index';

export default [query('verifyToken').custom(required), validate];
