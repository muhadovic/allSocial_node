import Boom from 'boom';

export const isTwoHat = (req, res, next) => {
    try {
        if (req.headers['x-api-key'] !== process.env.TWO_HAT_CALLBACK_KEY) {
            throw Boom.forbidden('Access denied.');
        }

        next();
    } catch (err) {
        next(err);
    }
};
