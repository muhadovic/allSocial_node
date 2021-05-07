import Boom from 'boom';

import logger from '../../config/logger';
import { getStreamClient } from '../../config/stream';
import twoHat from '../../config/twohat';
import { wrap } from '../base';

import Report from '../../models/report';

export default wrap(async (req) => {
    const reportingUser = req.user._id;
    const { reportedUser, activityId, activityVerb, type } = req.body;

    const isPost = activityVerb === 'post';
    let activityDetail;

    if (isPost) {
        activityDetail = await getStreamClient()
            .feed('user', reportedUser)
            .getActivityDetail(activityId, { enrich: true });
    } else {
        activityDetail = await getStreamClient().reactions.filter({
            user_id: reportedUser,
            id_lte: activityId,
            limit: 1,
            kind: 'comment',
        });
    }

    if (!activityDetail.results.length) {
        throw Boom.notFound(`${activityVerb} not found.`);
    }

    const activity = activityDetail.results[0];

    const twohatReport = {
        language: 'en',
        activityVerb,
        reporting_user_id: reportingUser,
        reported_user_id: reportedUser,
        reported_reason: type,
        content_id: activityId,
    };

    if (isPost) {
        const attachments = activity.attachments || {};
        const text = { user_id: reportedUser, type: 'text', text: activity.text };
        const images = (attachments.images || []).map((i) => ({ user_id: reportedUser, type: 'image', text: i }));
        const files = (attachments.files || []).map((f) => ({ user_id: reportedUser, type: f.mimeType, text: f.url }));
        const ogs = []
            .concat(attachments.og || [])
            .map((og) => ({ user_id: reportedUser, type: 'link', text: og.url }));

        twohatReport.chat_record = [...images, ...files, ...ogs, text];
    } else {
        twohatReport.text = activity.data.text;
        twohatReport.chat_record = [{ user_id: reportedUser, type: 'text', text: activity.data.text }];
    }

    const [report, twohat] = await Promise.all([
        Report.create({ reportingUser, reportedUser, activityId, activityVerb, type }),
        twoHat(isPost ? 'fp_report_short_text_with_history_with_multi_media' : 'fp_report_comment', twohatReport),
    ]);

    logger.info('reported activity', { twohat: twohat.data, report });

    return report;
});
