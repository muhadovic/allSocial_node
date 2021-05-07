import sanitizer from './recommendationsSanitizer';
import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';

export default wrap(async (req) => {
    const user_id = req.user._id;
    const limit = req.query.per_page || 5;
    const offset = req.query.page * limit || 0;

    const queryParams = { user_id, limit, offset };

    const streamClient = getStreamClient();

    const recoms = await streamClient.personalization.get('allsocial_follow_recs', queryParams);
    if (!recoms.results.length) return [];

    const recomIds = recoms.results.map(({ foreign_id }) => foreign_id.split(':')[1]);
    const users = await sanitizer(user_id, recomIds);

    return users.map((user) => user.data);
});
