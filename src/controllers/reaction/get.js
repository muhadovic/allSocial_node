import { getStreamClient } from '../../config/stream';
import { getBlockedList } from '../../utils/feed';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const options = req.query;

    const streamClient = getStreamClient();

    const [blockedList, reactions] = await Promise.all([
        getBlockedList(userId),
        streamClient.reactions.filter(options),
    ]);

    if (!reactions.results.length || options.kind !== 'comment') return reactions;

    const results = reactions.results.filter((comment) => comment.user && blockedList.indexOf(comment.user.id) === -1);

    return { ...reactions, results };
});
