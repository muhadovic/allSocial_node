import Boom from 'boom';

import FollowRelation from '../../models/follow-relation';
import { getStreamClient } from '../../config/stream';
import { isPublicProfile } from '../../utils/feed';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { profileId } = req.params;

    const followStatus = await FollowRelation.findOne({ follower: userId, following: profileId }).lean();
    if (followStatus && followStatus.status === 'block') throw Boom.conflict('you have blocked this user ');
    if (followStatus && followStatus.status === 'follow') return { following: 'follow' };
    if (followStatus && followStatus.status === 'request') return { following: 'request' };

    const blockStatus = await FollowRelation.findOne({ follower: profileId, following: userId }).lean();
    if (blockStatus && blockStatus.status === 'block') throw Boom.conflict('you have been blocked by this user');

    const isPublic = await isPublicProfile(profileId);
    const status = isPublic ? 'follow' : 'request';

    const streamClient = getStreamClient();
    const notificationPromise = streamClient.feed('notification', profileId).addActivity({
        actor: streamClient.user(userId),
        object: streamClient.user(userId),
        time: new Date().toISOString(),
        verb: isPublic ? 'follow' : 'follow_request',
    });

    await Promise.all([
        notificationPromise,
        FollowRelation.create({ follower: userId, following: profileId, status }),
        isPublic && streamClient.feed('timeline', userId).follow('user', profileId),
    ]);

    return { following: status };
});
