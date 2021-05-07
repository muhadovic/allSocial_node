import FollowRelation from '../../models/follow-relation';
import { isFollowing } from '../../utils/feed';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { profileId } = req.params;

    /* TODO: Truth source should be only FollowRelation, right now Collection is out of sync with stream */
    const [streamFollowing, following, streamFollower, follower] = await Promise.all([
        isFollowing(userId, profileId),
        FollowRelation.findOne({ follower: userId, following: profileId }).lean(),
        isFollowing(profileId, userId),
        FollowRelation.findOne({ follower: profileId, following: userId }).lean(),
    ]);

    return {
        following: streamFollowing ? 'follow' : !!following && following.status,
        follower: streamFollower ? 'follow' : !!follower && follower.status,
    };
});
