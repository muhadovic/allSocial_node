import Boom from 'boom';
import validator from 'validator';
import User from '../../models/user';
import { wrap } from '../base';
import { getStreamClient } from '../../config/stream';

export default wrap(async (req) => {
    let { profileId } = req.params;

    if (!validator.isMongoId(profileId)) {
        const user = await User.findOne({ username: profileId }, '_id').lean();
        if (!user) throw Boom.notFound('User not found');
        profileId = user._id;
    }

    const user = await getStreamClient()
        .user(profileId)
        .profile();

    return user.full;
});
