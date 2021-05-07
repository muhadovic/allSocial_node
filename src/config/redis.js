import redis from 'ioredis';
import logger from './logger';

const redisClient = redis.createClient(process.env.REDISCLOUD_URL);

redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('error', (err) => logger.error(err));

export default redisClient;
