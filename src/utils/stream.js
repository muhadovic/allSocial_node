import { getStreamClient } from '../config/stream';
import logger from '../config/logger';

const getFollows = async (userId, limit = 100) => {
    if (!userId) throw new Error('userId is required');

    const following = await getStreamClient()
        .feed('timeline', userId)
        .following({ limit });
    const followers = await getStreamClient()
        .feed('user', userId)
        .followers({ limit });

    return [...following.results, ...followers.results];
};

export const unfollowDeletedUser = async (userId) => {
    if (!userId) throw new Error('userId is required');

    let follows = await getFollows(userId);

    /* eslint-disable no-await-in-loop */
    while (follows.length) {
        const relations = follows.map((f) => ({ source: f.feed_id, target: f.target_id }));
        logger.info({ unfollowMany: { relations, userId } });

        await getStreamClient().unfollowMany(relations);

        follows = await getFollows(userId);
    }
};
