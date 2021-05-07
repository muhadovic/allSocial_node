import Boom from 'boom';

import User from '../models/user';

export const verifyAdminAccess = async (user = {}) => {
    const { _id, admin } = user;

    if (!_id) throw Boom.badData('missing _id in user obj');
    if (!admin) return false;

    return (await User.findById(_id, 'admin').lean()).admin;
};

export default async (req, res, next) => {
    if (req.user) req.user.admin = await verifyAdminAccess(req.user);

    next();
};
