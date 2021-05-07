import Boom from 'boom';

import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';
import { isPublicProfile } from '../../utils/feed';

export default wrap(async (req) => {
    const { actorId, foreignId, time } = req.body;

    if (!(await isPublicProfile(actorId))) throw Boom.forbidden('Private profile.');

    const activity = await getStreamClient()
        .feed('user', actorId)
        .updateActivityToTargets(foreignId, time, null, ['timeline:explore']);

    const { exploreAddTime } = await getStreamClient().activityPartialUpdate({
        id: activity.activity.id,
        set: { exploreAddTime: new Date().getTime() },
    });

    return { activity, exploreAddTime };
});
