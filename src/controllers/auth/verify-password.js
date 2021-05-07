import Boom from 'boom';

import { wrap, Redirect } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const { token } = req.query;

    if (!token) {
        throw Boom.badData('Token must be provided.');
    }

    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
        throw Boom.conflict('User cannot be found with that token.');
    }

    return new Redirect(
        `${process.env.ENV === 'production' ? 'https' : 'http'}://${
            process.env.DOMAIN
        }/auth/password-reset?token=${token}`,
    );
});
