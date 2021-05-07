import Boom from 'boom';

import FollowRelation from '../../models/follow-relation';
import twoHat from '../../config/twohat';
import { getStreamClient } from '../../config/stream';
import { extractMentions } from '../../utils/activity';
import { isPublicProfile } from '../../utils/feed';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { type, kind, activity, data, option } = req.body;
    const streamClient = getStreamClient();

    if (type === 'childReaction' && !option.parentId)
        throw Boom.badData('childReaction needs parentId attached to option');

    const [isBlocked, activityDetail] = await Promise.all([
        FollowRelation.findOne({
            follower: { $in: [userId, option.feedId] },
            following: { $in: [userId, option.feedId] },
            status: 'block',
        }),
        type === 'reaction'
            ? streamClient.feed('user', option.feedId).getActivityDetail(activity, {
                  user_id: userId,
                  withOwnReactions: true,
                  withOwnChildren: true,
              })
            : streamClient.reactions.filter({
                  activity_id: option.parentId,
                  id_lte: activity,
                  limit: 1,
                  with_activity_data: true,
              }),
    ]);

    if (!activityDetail.results.length) throw Boom.notFound('activity not found');
    if (type === 'childReaction' && !activityDetail.activity) throw Boom.notFound('activity not found');
    if (type === 'childReaction' && activityDetail.activity.actor.id !== option.feedId)
        throw Boom.notFound('wrong feedId');

    if (isBlocked) throw Boom.forbidden('Blocked user');

    const { own_reactions } = activityDetail.results[0];

    if (kind === 'comment') {
        if (!data.text) throw Boom.badData('empty comment text');

        const [mentions, toxic] = await Promise.all([
            extractMentions(data.text),
            twoHat('fp_check_short_text', { text: data.text, user_id: userId }),
        ]);

        if (!toxic.data.response) data.text = toxic.data.hashed;

        option.targetFeeds = [...(option.targetFeeds || []), ...mentions.targetMentions];
        data.mentions = mentions.users;
    } else if (kind === 'repost') {
        if (option.feedId !== userId && !(await isPublicProfile(option.feedId)))
            throw Boom.badData('Private profiles posts can not be reshared.');

        if (own_reactions && own_reactions.repost && own_reactions.repost.length)
            throw Boom.conflict('already reposted');
    } else if (kind === 'like') {
        if (own_reactions && own_reactions.like && own_reactions.like.length) throw Boom.conflict('already liked');
    }

    if (type === 'reaction') {
        const reaction = await streamClient.reactions.add(kind, activity, data, { ...option, userId });
        return reaction;
    }

    if (type === 'childReaction') {
        const childReaction = await streamClient.reactions.addChild(kind, activity, data, { ...option, userId });
        return childReaction;
    }
});
