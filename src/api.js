import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import sanitize from 'express-mongo-sanitize';
import enforce from 'express-sslify';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import Boom from 'boom';

import jwt from './middleware/jwt';
import admin from './middleware/admin';
import preventPreviewAccess from './middleware/preview-token';
import rateLimiter from './middleware/rate-limiter';
import routes from './routes';
import logger from './config/logger';

import './config/database';

const api = express();
api.set('port', process.env.PORT);
api.enable('trust proxy');

if (process.env.NODE_ENV === 'production') {
    api.use(enforce.HTTPS({ trustProtoHeader: true }));
}

api.use(helmet());
api.use(rateLimiter);
api.use(cors({ maxAge: 1728000 }));
api.use(compress());
api.use(sanitize());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(methodOverride());
api.use(jwt);
api.use(preventPreviewAccess);
api.use(admin);
api.use(routes);
api.use('/', (req, res, next) => res.redirect(`http://${process.env.DOMAIN}`));
api.use((req, res, next) => (req.route ? next() : next(new Error('Invalid request.'))));

api.use((err, req, res, next) => {
    let { message, statusCode } = Boom.isBoom(err) ? err.output.payload : err;

    if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Token is invalid.';
    } else if (err.error && err.error.status_code) {
        statusCode = err.error.status_code;
    }

    if (process.env.NODE_ENV === 'production') {
        logger.error(err, { req, stack: err.stack });
    } else {
        logger.error(err.stack);
    }

    res.status(statusCode || 400).json({ error: message });
});

export default api;
