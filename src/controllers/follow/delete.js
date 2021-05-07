import Boom from 'boom';

import FollowRelation from '../../models/follow-relation';
import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';

/* unfollow || delete follow request */
export default wrap(async (req) => {
    const userId = req.user._id;
    const { profileId } = req.params;

    if (userId === profileId) throw Boom.badData('You can not unfollow yourself.');

    const streamClient = getStreamClient();

    await Promise.all([
        FollowRelation.deleteOne({ follower: userId, following: profileId, status: { $in: ['follow', 'request'] } }),
        streamClient.feed('timeline', userId).unfollow('user', profileId),
    ]);

    return { following: false };
});
