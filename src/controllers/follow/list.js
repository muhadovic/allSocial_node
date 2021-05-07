import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const limit = req.query.per_page || 25;
    const offset = req.query.page * limit || 0;
    const { type } = req.query;

    let userIds;

    const streamClient = getStreamClient();

    if (type === 'following') {
        const following = await streamClient.feed('timeline', userId).following({ limit, offset });
        userIds = following.results.map(({ target_id }) => target_id.split(':')[1]);
    } else {
        const followers = await streamClient.feed('user', userId).followers({ limit, offset });
        userIds = followers.results.map(({ feed_id }) => feed_id.split(':')[1]);
    }

    /* remove user itself from list */
    userIds = userIds.filter((id) => id !== userId);

    if (!userIds.length) return [];

    const users = await streamClient.collections.select('user', userIds);

    return users.response.data.map((user) => user.data);
});
