import FollowRelation from '../models/follow-relation';
import { getStreamClient } from '../config/stream';

export const isFollowing = async (userId, profileId) => {
    if (!userId || !profileId) throw new Error('userId, profileId can not be empty');

    const following = await getStreamClient()
        .feed('timeline', userId)
        .following({ filter: [`user:${profileId}`] });

    return following.results.length === 1;
};

export const isPublicProfile = async (profileId) => {
    if (!profileId) throw new Error('profileId is required');

    const profile = await getStreamClient()
        .user(profileId)
        .profile();

    if (typeof profile.data.isPublic === 'boolean') return profile.data.isPublic;
    return true;
};

export const getBlockedList = async (userId) => {
    const relations = await FollowRelation.find({
        $or: [{ follower: userId }, { following: userId }],
        status: 'block',
    }).lean();

    return relations
        .map((rel) => (rel.follower.toString() === userId ? rel.following.toString() : rel.follower.toString()))
        .filter((rel) => rel !== userId);
};
