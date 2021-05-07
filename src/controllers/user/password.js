import Boom from 'boom';

import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const {
        user: { _id },
        body: { current, update },
    } = req;

    const user = await User.findById(_id);

    const isValidPassword = await user.verifyHash(current);

    if (!isValidPassword) {
        throw Boom.badData('No user exists with that current password.');
    }

    const tokenSecret = await user.generateTokenSecret();

    const updatedUser = await User.findOneAndUpdate(
        { _id },
        {
            $set: {
                hash: update,
            },
            tokenSecret,
        },
        {
            new: true,
            projection: {
                __v: 0,
                streamToken: 0,
                algoliaId: 0,
                passwordResetToken: 0,
                hash: 0,
                emailToken: 0,
                tokenSecret: 0,
            },
        },
    );

    return {
        status: 'User has been successfully updated.',
        user: updatedUser,
    };
});
