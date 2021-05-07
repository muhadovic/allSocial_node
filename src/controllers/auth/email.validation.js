import { check, validate } from '../../utils/validation/index';

export default [check('email', 'Invalid email address.').isEmail(), validate];
