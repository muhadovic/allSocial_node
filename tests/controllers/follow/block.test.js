import test from 'ava';
import Boom from 'boom';

import { authedRequest, createUser, cleanUser } from '../../fixtures/auth';
import FollowRelation from '../../../src/models/follow-relation';
import { isFollowing } from '../../../src/utils/feed';

test.before(async (t) => {
    t.context.authenticatedUser = await createUser();
    t.context.publicUser = await createUser();
    t.context.privateUser = await createUser({ isPublic: false });
});

test.serial('POST /follow/:profileId/block : block yourself', async (t) => {
    const res = await authedRequest(
        'post',
        `/follow/${t.context.authenticatedUser._id}/block`,
        t.context.authenticatedUser,
    );

    t.is(res.status, Boom.badData().output.statusCode);
});

test.serial('POST /follow/:profileId/block : block a user without relationship', async (t) => {
    const res = await authedRequest('post', `/follow/${t.context.publicUser._id}/block`, t.context.authenticatedUser);

    const following = await isFollowing(t.context.authenticatedUser._id, t.context.publicUser._id);
    const follower = await isFollowing(t.context.publicUser._id, t.context.authenticatedUser._id);

    const followingRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: 'block',
    });
    const followerRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: { $in: ['follow', 'request'] },
    });

    t.is(res.status, 200);

    t.truthy(followingRel);
    t.is(followerRel, null);

    t.false(following);
    t.false(follower);
    t.deepEqual(res.body, { following: 'block' });
});

test.serial('POST /follow/:profileId/block : block a public user with two-way relationship', async (t) => {
    await authedRequest('post', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}`, t.context.publicUser);

    const res = await authedRequest('post', `/follow/${t.context.publicUser._id}/block`, t.context.authenticatedUser);

    const following = await isFollowing(t.context.authenticatedUser._id, t.context.publicUser._id);
    const follower = await isFollowing(t.context.publicUser._id, t.context.authenticatedUser._id);

    const followingRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: 'block',
    });
    const followerRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: { $in: ['follow', 'request'] },
    });

    t.is(res.status, 200);

    t.truthy(followingRel);
    t.is(followerRel, null);

    t.false(following);
    t.false(follower);
    t.deepEqual(res.body, { following: 'block' });
});

test.serial('POST /follow/:profileId/block : block a private user with two-way relationship', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}`, t.context.privateUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}/request`, t.context.privateUser);

    const res = await authedRequest('post', `/follow/${t.context.privateUser._id}/block`, t.context.authenticatedUser);

    const following = await isFollowing(t.context.authenticatedUser._id, t.context.privateUser._id);
    const follower = await isFollowing(t.context.privateUser._id, t.context.authenticatedUser._id);

    const followingRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'block',
    });
    const followerRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: { $in: ['follow', 'request'] },
    });

    t.is(res.status, 200);

    t.truthy(followingRel);
    t.is(followerRel, null);

    t.false(following);
    t.false(follower);
    t.deepEqual(res.body, { following: 'block' });
});

test.serial('POST /follow/:profileId/block : block a user in request status', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}`, t.context.privateUser);

    const res = await authedRequest('post', `/follow/${t.context.privateUser._id}/block`, t.context.authenticatedUser);

    const following = await isFollowing(t.context.authenticatedUser._id, t.context.privateUser._id);
    const follower = await isFollowing(t.context.privateUser._id, t.context.authenticatedUser._id);

    const followingRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'block',
    });
    const followerRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: { $in: ['follow', 'request'] },
    });

    t.is(res.status, 200);

    t.truthy(followingRel);
    t.is(followerRel, null);

    t.false(following);
    t.false(follower);
    t.deepEqual(res.body, { following: 'block' });
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.publicUser._id);
    await cleanUser(t.context.privateUser._id);
});
