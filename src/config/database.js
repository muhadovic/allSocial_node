import mongoose from 'mongoose';
import logger from './logger';

const db = mongoose.connection;

mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

db.on('connected', () => {
    logger.info('Database connected.');
});

db.on('error', (err) => {
    logger.error(err);
});

db.on('disconnected', () => {
    logger.info('Database disconnected.');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        process.exit(0);
    });
});

export default db;
