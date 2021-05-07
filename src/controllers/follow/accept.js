import Boom from 'boom';

import FollowRelation from '../../models/follow-relation';
import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { profileId } = req.params;

    const followRequest = await FollowRelation.findOne({
        follower: profileId,
        following: userId,
        status: 'request',
    }).lean();

    if (!followRequest) throw Boom.badData('No follow request found.');

    const streamClient = getStreamClient();

    await Promise.all([
        streamClient.feed('timeline', profileId).follow('user', userId),
        FollowRelation.findByIdAndUpdate(followRequest._id, { status: 'follow' }),
        streamClient.feed('notification', profileId).addActivity({
            actor: streamClient.user(userId),
            object: streamClient.user(userId),
            time: new Date().toISOString(),
            verb: 'follow_accept',
        }),
    ]);

    return { follower: 'follow' };
});
