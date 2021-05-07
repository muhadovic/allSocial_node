import Boom from 'boom';

import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const user_id = req.params.userId;

    const user = await User.findByIdAndUpdate(
        user_id,
        { flagged: false, unflagAt: null, flaggedAt: null },
        { new: true, projection: { flagged: 1, unflagAt: 1, flaggedAt: 1 } },
    );

    if (!user) throw Boom.badData('No such user exists.');

    return user;
});
