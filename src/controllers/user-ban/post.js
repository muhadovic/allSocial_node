import moment from 'moment';
import Boom from 'boom';

import { sendBanEmail } from '../../utils/email/send';
import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const { user_id, unflag_at, reason } = req.body;

    const user = await User.findById(user_id);
    if (!user) throw Boom.badData('No such user exists');
    if (user.admin) throw Boom.badData('Admin users can not be flagged');

    const tokenSecret = await user.generateTokenSecret();
    const flaggedUser = await User.findByIdAndUpdate(
        user_id,
        { tokenSecret, flagged: true, unflagAt: unflag_at, flaggedAt: new Date() },
        { new: true, projection: { flagged: 1, unflagAt: 1, flaggedAt: 1 } },
    );

    const duration = unflag_at && moment.utc(unflag_at).fromNow();
    await sendBanEmail(user.email, reason, duration);

    return flaggedUser;
});
