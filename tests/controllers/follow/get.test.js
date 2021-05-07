import test from 'ava';
import { authedRequest, createUser, cleanUser } from '../../fixtures/auth';
import FollowRelation from '../../../src/models/follow-relation';
import { isFollowing } from '../../../src/utils/feed';

test.before(async (t) => {
    t.context.authenticatedUser = await createUser();
    t.context.publicUser = await createUser();
    t.context.privateUser = await createUser({ isPublic: false });
});

test.serial('GET /follow/:profileId : basic PUBLIC profile', async (t) => {
    const res = await authedRequest('get', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    t.is(res.status, 200);
    t.deepEqual(res.body, {
        following: false,
        follower: false,
    });
});

test.serial('GET /follow/:profileId : basic PRIVATE profile', async (t) => {
    const res = await authedRequest('get', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);

    t.is(res.status, 200);
    t.deepEqual(res.body, {
        following: false,
        follower: false,
    });
});

test.serial('GET /follow/:profileId : PUBLIC profile followed', async (t) => {
    await authedRequest('post', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    const res = await authedRequest('get', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);
    const following = await isFollowing(t.context.authenticatedUser._id, t.context.publicUser._id);
    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: 'follow',
    });

    t.is(res.status, 200);
    t.truthy(rel);
    t.truthy(following);
    t.deepEqual(res.body, {
        following: 'follow',
        follower: false,
    });
});

test.serial('GET /follow/:profileId : PRIVATE profile follow requested', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);

    const res = await authedRequest('get', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    const following = await isFollowing(t.context.authenticatedUser._id, t.context.privateUser._id);
    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'request',
    });

    t.is(res.status, 200);
    t.truthy(rel);
    t.false(following);
    t.deepEqual(res.body, {
        following: 'request',
        follower: false,
    });
});

test.serial('GET /follow/:profileId : PRIVATE profile follow accepted', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}/request`, t.context.privateUser);

    const res = await authedRequest('get', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    const following = await isFollowing(t.context.authenticatedUser._id, t.context.privateUser._id);
    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'follow',
    });

    t.is(res.status, 200);
    t.truthy(rel);
    t.true(following);
    t.deepEqual(res.body, {
        following: 'follow',
        follower: false,
    });
});

test.serial('GET /follow/:profileId : PRIVATE profile follow rejected', async (t) => {
    await authedRequest('del', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    await authedRequest('del', `/follow/${t.context.authenticatedUser._id}/request`, t.context.privateUser);

    const res = await authedRequest('get', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    const following = await isFollowing(t.context.authenticatedUser._id, t.context.privateUser._id);
    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: { $in: ['follow', 'request'] },
    });

    t.is(res.status, 200);
    t.is(rel, null);
    t.false(following);
    t.deepEqual(res.body, {
        following: false,
        follower: false,
    });
});

test.serial('GET /follow/:profileId : User is following PRIVATE profile and vice versa', async (t) => {
    // cleanup prev relationships
    await authedRequest('del', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    await authedRequest('del', `/follow/${t.context.privateUser._id}/request`, t.context.authenticatedUser);
    await authedRequest('del', `/follow/${t.context.authenticatedUser._id}`, t.context.privateUser);
    await authedRequest('del', `/follow/${t.context.authenticatedUser._id}/request`, t.context.privateUser);

    await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}`, t.context.privateUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}/request`, t.context.privateUser);

    const res = await authedRequest('get', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    const following = await isFollowing(t.context.authenticatedUser._id, t.context.privateUser._id);
    const follower = await isFollowing(t.context.privateUser._id, t.context.authenticatedUser._id);
    const followingRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'follow',
    });
    const followerRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'follow',
    });

    t.is(res.status, 200);
    t.truthy(followingRel);
    t.truthy(followerRel);
    t.true(following);
    t.true(follower);
    t.deepEqual(res.body, {
        following: 'follow',
        follower: 'follow',
    });
});

test.serial('GET /follow/:profileId : User is following PUBLIC profile and vice versa', async (t) => {
    // cleanup prev relationships
    await authedRequest('del', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);
    await authedRequest('del', `/follow/${t.context.authenticatedUser._id}`, t.context.publicUser);

    await authedRequest('post', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}`, t.context.publicUser);

    const res = await authedRequest('get', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);
    const following = await isFollowing(t.context.authenticatedUser._id, t.context.publicUser._id);
    const follower = await isFollowing(t.context.publicUser._id, t.context.authenticatedUser._id);
    const followingRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: 'follow',
    });
    const followerRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: 'follow',
    });

    t.is(res.status, 200);
    t.truthy(followingRel);
    t.truthy(followerRel);
    t.true(following);
    t.true(follower);
    t.deepEqual(res.body, {
        following: 'follow',
        follower: 'follow',
    });
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.publicUser._id);
    await cleanUser(t.context.privateUser._id);
});
