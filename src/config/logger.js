import winston from 'winston';
import Sentry from 'winston-sentry-raven-transport';
import { NullTransport } from 'winston-null';

const logger = winston.createLogger({ exitOnError: false });

if (process.env.TESTING) {
    logger.add(new NullTransport());
} else {
    logger.add(
        new Sentry({
            dsn: process.env.SENTRY,
            environment: process.env.DOMAIN,
            level: 'info',
            install: true,
            captureUnhandledRejections: true,
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' })),
        }),
    );

    if (process.env.NODE_ENV !== 'production' || process.env.CONSOLE_LOG) {
        logger.add(
            new winston.transports.Console({
                format: winston.format.combine(winston.format.simple()),
            }),
        );
    }
}

export default logger;
