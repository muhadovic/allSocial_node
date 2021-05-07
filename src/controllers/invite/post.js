import User from '../../models/user';
import { sendInvites } from '../../utils/email/send';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { emails } = req.body;

    const user = await User.findById(userId).lean();
    const link = `http://${process.env.DOMAIN}/${user.username}?follow=${user.username}`;

    return sendInvites(emails.slice(0, 10), link, user.name, user.profileImage);
});
