import jwt from 'express-jwt';

import User from '../models/user';
import redis from '../config/redis';

export const getSecret = async (payload, done) => {
    try {
        const { _id: userId } = payload;
        if (!userId) throw new Error('Missing _id in payload.');

        let tokenSecret = await redis.get(`tokenSecret:${userId}`);
        if (!tokenSecret) {
            ({ tokenSecret } = (await User.findById(userId, 'tokenSecret')) || {});
            if (!tokenSecret) throw new Error('User does not exist.');
            await redis.set(`tokenSecret:${userId}`, tokenSecret);
        }

        done(null, `${process.env.JWT_SECRET}${tokenSecret}`);
    } catch (err) {
        done(err);
    }
};

export default jwt({ secret: (req, payload, done) => getSecret(payload, done) }).unless({
    path: ['/', '/status', '/preview-token', /\/auth*/, /\/twohat*/, '/favicon.ico'],
});
