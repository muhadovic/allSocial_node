import { getStreamClient } from '../../config/stream';

import { wrap } from '../base';

export default wrap(async (req) => {
    const { actorId, foreignId, time } = req.body;

    return getStreamClient()
        .feed('user', actorId)
        .updateActivityToTargets(foreignId, time, null, null, ['timeline:explore']);
});
