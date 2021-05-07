import RateLimit from 'express-rate-limit';

const rateLimit = new RateLimit({
    windowMs: 10 * 60 * 1000,
    max: 200,
    delayMs: 0,
    message: 'Too many requests, please try again later.',
});

export default rateLimit;
