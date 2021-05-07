import Boom from 'boom';

import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const {
        user: { _id },
        body: { password },
    } = req;

    const user = await User.findById(_id);

    if (!user) {
        throw Boom.badData('User with that token does not exist.');
    }

    const tokenSecret = await user.generateTokenSecret();

    await User.findOneAndUpdate(
        { _id: user._id },
        {
            $set: {
                hash: password,
                passwordResetToken: '',
                tokenSecret,
            },
        },
    );

    return { response: 'Password has been successfully updated.' };
});
