import Boom from 'boom';
import { validationResult } from 'express-validator/check';

export { check, query, param, body } from 'express-validator/check';
export { twohat } from './checks/twohat';
export { length } from './checks/length';
export { match } from './checks/match';
export { unique } from './checks/unique';
export { required } from './checks/required';
export { sanitizeInt } from './checks/sanitizeInt';
export { isMongoId } from './checks/isMongoId';
export { isBoolean } from './checks/isBoolean';
export { isTwoHat } from './checks/isTwoHat';
export { isAdmin } from './checks/isAdmin';
export { isModerator } from './checks/isModerator';

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw Boom.badData(errors.array()[0].msg);
    }

    next();
};
