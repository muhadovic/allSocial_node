import test from 'ava';

import { createUser, cleanUser } from '../fixtures/auth';
import jwt, { getSecret } from '../../src/middleware/jwt';
import User from '../../src/models/user';
import redis from '../../src/config/redis';

test.before(async (t) => {
    t.context.user = await createUser();
    t.context.tokenSecret = await redis.get(`tokenSecret:${t.context.user._id}`);
});

test('jwt middleware is a function', (t) => {
    t.is(typeof jwt, 'function');
});

test.cb('getSecret should throws without _id', (t) => {
    const callback = (err) => {
        t.true(err instanceof Error);
        t.end();
    };

    getSecret({}, callback);
});

test.cb('getSecret should throws non existent user', (t) => {
    const callback = (err) => {
        t.true(err instanceof Error);
        t.end();
    };

    getSecret({ _id: '507f1f77bcf86cd799439011' }, callback);
});

test.cb('getSecret should return generate and return a tokenSecret', (t) => {
    const callback = async (err, tokenSecret) => {
        t.falsy(err);
        t.truthy(tokenSecret);

        const user = await User.findById(t.context.user._id, 'tokenSecret');
        const token = await redis.get(`tokenSecret:${t.context.user._id}`);

        t.truthy(user);
        t.truthy(user.tokenSecret);
        t.truthy(token);
        t.is(token, user.tokenSecret);
        t.is(tokenSecret, `${process.env.JWT_SECRET}${token}`);
        t.end();
    };

    getSecret({ _id: t.context.user._id }, callback);
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.user._id);
});
