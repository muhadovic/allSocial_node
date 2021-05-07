import request from 'supertest';
import nanoid from 'nanoid';

import api from '../../src/api';
import User from '../../src/models/user';
import { getStreamClient } from '../../src/config/stream';

export const generateUser = () => {
    const id = nanoid(10);

    return {
        email: `test${id}@test${id}.com`,
        username: `test_${id}`,
        name: `testuser`,
        verified: true,
        tokenSecret: id,
        hash: id,
        isPublic: true,
    };
};

export const createUser = async (data = { isPublic: true }, skipStream = false) => {
    const user = await User.create({ ...generateUser(), ...data });

    if (!skipStream)
        await getStreamClient()
            .user(user._id)
            .getOrCreate({
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                isPublic: user.isPublic,
            });

    return user;
};

export const cleanUser = async (userId) => {
    await User.findByIdAndDelete(userId);
    try {
        await getStreamClient()
            .user(userId)
            .delete();
        // eslint-disable-next-line no-empty
    } catch (err) {}
};

export const authenticate = async (req, user) => {
    const _user = user || (await createUser());
    const token = await _user.generateJWToken();

    return req.set('Authorization', `Bearer ${token.appToken}`);
};

export const authedRequest = async (method, path, user) => {
    return authenticate(request(api)[method](path), user);
};
