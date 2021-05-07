import Boom from 'boom';

import { wrap } from '../base';
import User from '../../models/user';
import logger from '../../config/logger';

export default wrap(async (req) => {
    const {
        user: { _id },
    } = req;

    const userToDelete = await User.findById(_id);

    if (!userToDelete) {
        throw Boom.notFound('No user exists with that id.');
    }

    if (userToDelete.admin === 1) {
        throw Boom.conflict('User is an admin and cannot be deleted.');
    }

    logger.info('UserDeleteRequest', { req, userToDelete });
    await userToDelete.remove();
});
