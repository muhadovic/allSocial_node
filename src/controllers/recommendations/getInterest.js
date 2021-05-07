import sanitizer from './recommendationsSanitizer';
import { getStreamClient } from '../../config/stream';
import { wrap } from '../base';

export default wrap(async (req) => {
    const user_id = req.user._id;
    const { limit = 20, interest = '' } = req.query;

    const streamClient = getStreamClient();

    const recoms = await streamClient.personalization.get('allsocial_interest_recs', { interest, limit });

    if (!recoms.results.length) return [];

    const recomIds = recoms.results.map(({ foreign_id }) => foreign_id.split(':')[1]).filter((id) => id !== user_id);
    const users = await sanitizer(user_id, recomIds);

    return users
        .filter((user) => (typeof user.data.isPublic === 'boolean' ? user.data.isPublic : true))
        .map((user) => user.data);
});
