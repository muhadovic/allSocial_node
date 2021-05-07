/* eslint-disable no-await-in-loop */
import Boom from 'boom';

import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';

import Report from '../../models/report';
import logger from '../../config/logger';

export default wrap(async (req) => {
    let { activityId, userId } = req.body;
    const isPost = req.body.activityVerb === 'post';

    const streamClient = getStreamClient();

    let activityDetail;
    if (isPost) {
        activityDetail = await streamClient.feed('user', userId).getActivityDetail(activityId, { enrich: true });
    } else {
        activityDetail = await streamClient.reactions.filter({
            user_id: userId,
            id_lte: activityId,
            limit: 1,
            kind: 'comment',
        });
    }

    activityDetail = activityDetail && activityDetail.results[0];

    if (!activityDetail) throw Boom.notFound(`activity not found.`);

    logger.info('Delete Activity', { activityDetail, admin: req.user, twohat: !!req.headers['x-api-key'] });

    if (isPost && activityDetail.verb === 'repost') {
        activityDetail = activityDetail.object;
        userId = activityDetail.actor.id;
        activityId = activityDetail.id;
    }

    let streamRemoved;
    if (isPost) {
        /* Delete original Activity */
        streamRemoved = await streamClient.feed('user', userId).removeActivity(activityId);

        /* Delete reposted Activities */
        /* TODO: move to worker process */
        let nextResponse = true;
        while (nextResponse) {
            const reposts = await streamClient.reactions.filter({
                activity_id: activityId,
                limit: 25 /* maximum limit of stream */,
                kind: 'repost',
            });
            await Promise.all((reposts.results || []).map((repost) => streamClient.reactions.delete(repost.id)));

            nextResponse = !!reposts.next;
        }
    } else {
        streamRemoved = await streamClient.reactions.delete(activityId);
    }

    const dbRemoved = await Report.deleteMany({ activityId });

    return { ...streamRemoved, dbRemoved: dbRemoved.n };
});
