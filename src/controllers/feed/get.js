import Boom from 'boom';
import validator from 'validator';

import User from '../../models/user';
import FollowRelation from '../../models/follow-relation';
import { getStreamClient } from '../../config/stream';
import { isFollowing, isPublicProfile, getBlockedList } from '../../utils/feed';
import { wrap } from '../base';
import logger from '../../config/logger';

export default wrap(async (req) => {
    const { _id: userId, admin } = req.user;
    const { feedGroup } = req.params;
    let { feedId } = req.params;
    const options = req.query || {};

    // skip checks for public feeds `timeline:all` and `hashtags:${id}`
    const isPublicFeed =
        feedGroup === 'hashtag' || (feedGroup === 'timeline' && (feedId === 'all' || feedId === 'explore'));

    if (!isPublicFeed && !validator.isMongoId(feedId)) {
        const user = await User.findOne({ username: feedId }, '_id').lean();
        if (!user) throw Boom.notFound('User not found');
        feedId = user._id;
    }

    const [isPublicUser, following, blockedList] = await Promise.all([
        isPublicFeed ? true : isPublicProfile(feedId),
        isPublicFeed ? false : isFollowing(userId, feedId),
        getBlockedList(userId),
    ]);

    if (blockedList.indexOf(feedId) !== -1) throw Boom.forbidden('Blocked user');
    if (!isPublicUser && !following && !admin) throw Boom.forbidden('Private profile.');

    const streamClient = getStreamClient();
    const feed = await streamClient.feed(feedGroup, feedId).get({ ...options, user_id: userId });

    let { results } = feed;
    try {
        /* remove private user's posts + sanitize blocked users */
        if (isPublicFeed) {
            results = results.filter(
                (result) =>
                    result.actor &&
                    result.actor.data &&
                    (typeof result.actor.data.isPublic === 'boolean' ? result.actor.data.isPublic : true) &&
                    blockedList.indexOf(result.actor.id) === -1,
            );
        }

        /* sanitize blocked users comments */
        results = results
            .filter(
                (result) =>
                    result.verb !== 'repost' ||
                    !result.object.actor ||
                    blockedList.indexOf(result.object.actor.id) === -1,
            )
            .map((result) => {
                if (result.latest_reactions && result.latest_reactions.comment) {
                    result.latest_reactions.comment = result.latest_reactions.comment.filter(
                        (comment) => comment.user && blockedList.indexOf(comment.user.id) === -1,
                    );
                }

                return result;
            });
    } catch (err) {
        logger.error(err, { req, blockedList, feed, stack: err.stack });
    }

    try {
        /* attach follow status to retrieved activities */

        if (feedId === userId || following) {
            /* skip follow check for user's feeds */
            results = results.map((result) => ({ ...result, actor: { ...result.actor, following: 'follow' } }));
        } else {
            const actors = results.map((result) => result.actor.id).filter((e, i, a) => a.indexOf(e) === i);

            let followings = await FollowRelation.find({ follower: userId, following: { $in: actors } }).lean();
            followings = followings.reduce((acc, f) => {
                acc[f.following] = f.status;
                return acc;
            }, {});
            followings[userId] = 'follow';

            results = results.map((result) => ({
                ...result,
                actor: { ...result.actor, following: followings[result.actor.id] },
            }));
        }
    } catch (err) {
        logger.error(err, { req, feed, stack: err.stack });
    }

    return { ...feed, results };
});
