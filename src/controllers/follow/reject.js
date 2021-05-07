import FollowRelation from '../../models/follow-relation';
import { wrap } from '../base';

export default wrap(async (req) => {
    const userId = req.user._id;
    const { profileId } = req.params;

    await FollowRelation.deleteOne({ follower: profileId, following: userId, status: 'request' });
});
