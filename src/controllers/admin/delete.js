import Boom from 'boom';

import { wrap } from '../base';
import logger from '../../config/logger';
import User from '../../models/user';
import BannedEmail from '../../models/banned-email';

export default wrap(async (req) => {
    const {
        params: { id },
        body: { ban },
    } = req;

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
        throw Boom.conflict('No user exists with that id.');
    }

    if (userToDelete.admin === 1) {
        throw Boom.conflict('User is an admin and cannot be deleted.');
    }

    logger.info('UserDeleteRequest', { req, userToDelete, ban, by: req.user._id });
    await Promise.all([userToDelete.remove(), ban && BannedEmail.create({ email: userToDelete.email })]);
});
