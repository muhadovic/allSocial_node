import Boom from 'boom';

import FollowRelation from '../../models/follow-relation';
import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { profileId } = req.params;

    if (userId === profileId) throw Boom.badData('You can not block yourself.');

    const streamClient = getStreamClient();

    await Promise.all([
        streamClient.feed('timeline', userId).unfollow('user', profileId),
        streamClient.feed('timeline', profileId).unfollow('user', userId),
        FollowRelation.deleteOne({ follower: profileId, following: userId, status: { $in: ['follow', 'request'] } }),
        FollowRelation.findOneAndUpdate(
            { follower: userId, following: profileId },
            { status: 'block' },
            { upsert: true },
        ),
    ]);

    return { following: 'block' };
});
