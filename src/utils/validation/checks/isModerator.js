import Boom from 'boom';

import User from '../../../models/user';

export const isModerator = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            throw Boom.badRequest('User does not exist.');
        }

        if (user.admin === 0) {
            throw Boom.forbidden('Requires at least moderator access.');
        }

        next();
    } catch (err) {
        next(err);
    }
};
