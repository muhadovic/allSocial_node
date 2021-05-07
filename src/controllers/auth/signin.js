import moment from 'moment';
import Boom from 'boom';

import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const { email: emailOrUsername, password } = req.body;

    const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
        throw Boom.badData('Invalid email/username or password.');
    }

    if (user.flagged) {
        const { unflagAt } = user;

        if (!unflagAt) {
            throw Boom.notFound('You have been banned, please contact support at support@allsocial.com.');
        }

        if (new Date(unflagAt).getTime() > new Date().getTime()) {
            const unflagOn = moment.utc(unflagAt).fromNow();
            throw Boom.notFound(`You have been banned, you can access your account ${unflagOn}.`);
        }

        await user.updateOne({ flagged: false, unflagAt: null });
    }

    const isValidPassword = await user.verifyHash(password);

    if (!isValidPassword) {
        throw Boom.forbidden('Invalid email/username or password.');
    }

    if (!user.tokenSecret) {
        const tokenSecret = await user.generateTokenSecret();

        await user.updateOne({ tokenSecret });
    }

    const token = await user.generateJWToken();

    return token;
});
