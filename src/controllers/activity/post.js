import Boom from 'boom';

import { getStreamClient } from '../../config/stream';
import { extractHashtags, extractMentions } from '../../utils/activity';
import { isPublicProfile } from '../../utils/feed';

import { wrap } from '../base';

import TimedPost from '../../models/timed-post';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { feedGroup, activityData } = req.body;

    if (!feedGroup || !activityData || !activityData.verb || !activityData.object) {
        throw Boom.badData('feedGroup and activityData is required.');
    }

    const isPublic = await isPublicProfile(userId);
    const hashtags = isPublic ? extractHashtags(activityData.text) : [];

    const { users, targetMentions } = await extractMentions(activityData.text);
    activityData.to = ['timeline:all', ...hashtags, ...targetMentions];
    activityData.mentions = users;

    const time = new Date().toISOString();
    const foreign_id = `${userId}:${activityData.verb}:${time}`;

    const [activity] = await Promise.all([
        getStreamClient()
            .feed(feedGroup, userId)
            .addActivity({
                ...activityData,
                time,
                foreign_id,
                actor: getStreamClient().user(userId),
            }),

        /* Store information of TimedPost */
        activityData.deleteOn &&
            TimedPost.create({
                user: userId,
                postId: foreign_id,
                timestamp: activityData.deleteOn,
            }),
    ]);

    return activity;
});
