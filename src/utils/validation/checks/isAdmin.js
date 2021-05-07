import Boom from 'boom';

export const isAdmin = async (req, res, next) => {
    if (!req.user) throw Boom.badRequest('User does not exist.');
    if (!req.user.admin) throw Boom.forbidden('Requires admin access.');

    next();
};
