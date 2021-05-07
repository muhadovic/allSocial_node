import 'dotenv/config';
import api from './api';
import logger from './config/logger';

api.listen(process.env.PORT, (err) => {
    if (err) return logger.error(err);
    logger.info(`Server is running`);
});

process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection at: \n ${reason.stack || reason}`);
});

process.on('uncaughtException', (err) => {
    logger.error(`Caught exception: ${err}`);
});
