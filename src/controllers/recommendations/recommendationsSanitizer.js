import FollowRelation from '../../models/follow-relation';
import { getBlockedList } from '../../utils/feed';
import { getStreamClient } from '../../config/stream';

export default async (user_id, Ids) => {
    const [users, followRelations, blockedList] = await Promise.all([
        getStreamClient().collections.select('user', Ids),
        FollowRelation.find({ follower: user_id, following: { $in: Ids } }, 'following').lean(),
        getBlockedList(user_id),
    ]);

    const followIds = followRelations.map((f) => f.following.toString());
    return users.response.data.filter(
        (user) => user.id && !followIds.includes(user.id) && !blockedList.includes(user.id),
    );
};
