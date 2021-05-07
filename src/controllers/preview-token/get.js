import nanoid from 'nanoid/async';

import User from '../../models/user';
import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';

export default wrap(async () => {
    let user = await User.findOne({ username: 'preview' });

    if (!user) {
        user = new User({
            name: 'preview',
            username: 'preview',
            email: 'preview@allsocial.com',
            hash: await nanoid(),
        });

        user.tokenSecret = await user.generateTokenSecret();

        await Promise.all([
            user.save(),
            getStreamClient()
                .user(user._id.toString())
                .getOrCreate({
                    _id: user._id.toString(),
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    isPublic: true,
                    isPreviewToken: true,
                }),
        ]);
    }

    // preview token won't expire
    return user.generateJWToken('', { anon: true });
});
