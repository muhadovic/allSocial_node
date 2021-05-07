import Boom from 'boom';

import FollowRelation from '../../models/follow-relation';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { profileId } = req.params;

    if (userId === profileId) throw Boom.badData('You can not unblock yourself.');

    await FollowRelation.deleteOne({ follower: userId, following: profileId, status: 'block' });
});
