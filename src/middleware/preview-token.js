import Boom from 'boom';
import Unless from 'express-unless';

const preventPreviewAccess = (req, res, next) => {
    if (req.user && req.user.isPreviewToken) throw Boom.forbidden('Preview Token restricted access');

    next();
};

preventPreviewAccess.unless = Unless;

export default preventPreviewAccess.unless({
    path: [
        { url: /\/feed*/, methods: ['GET'] },
        { url: /\/profile*/, methods: ['GET'] },
        { url: /\/follow*/, methods: ['GET'] },
        { url: /\/reaction*/, methods: ['GET'] },
    ],
});
