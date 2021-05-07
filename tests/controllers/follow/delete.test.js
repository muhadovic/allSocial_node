import test from 'ava';
import Boom from 'boom';

import { authedRequest, createUser, cleanUser } from '../../fixtures/auth';
import FollowRelation from '../../../src/models/follow-relation';

test.before(async (t) => {
    t.context.authenticatedUser = await createUser();
    t.context.publicUser = await createUser();
    t.context.privateUser = await createUser({ isPublic: false });
});

test.serial('DEL /follow/:profileId : unfollow yourself', async (t) => {
    const res = await authedRequest('del', `/follow/${t.context.authenticatedUser._id}/`, t.context.authenticatedUser);

    t.is(res.status, Boom.badData().output.statusCode);
});

test.serial('DEL /follow/:profileId : unfollow a PUBLIC user ', async (t) => {
    const res = await authedRequest('del', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    const Rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: { $in: ['request', 'follow'] },
    });

    t.is(res.status, 200);
    t.is(Rel, null);
    t.deepEqual(res.body, { following: false });
});

test.serial('DEL /follow/:profileId : unfollow a followed PUBLIC user ', async (t) => {
    await authedRequest('post', `/follow/${t.context.publicUser._id}/`, t.context.authenticatedUser);

    const res = await authedRequest('del', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    const Rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: { $in: ['request', 'follow'] },
    });

    t.is(res.status, 200);
    t.is(Rel, null);
    t.deepEqual(res.body, { following: false });
});

test.serial('DEL /follow/:profileId : unfollow a requested PRIVATE user ', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}/`, t.context.authenticatedUser);

    const res = await authedRequest('del', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);

    const Rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: { $in: ['request', 'follow'] },
    });

    t.is(res.status, 200);
    t.is(Rel, null);
    t.deepEqual(res.body, { following: false });
});

test.serial('DEL /follow/:profileId : unfollow a followed PRIVATE user ', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}/`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}/request`, t.context.privateUser);

    const res = await authedRequest('del', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);

    const Rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: { $in: ['request', 'follow'] },
    });

    t.is(res.status, 200);
    t.is(Rel, null);
    t.deepEqual(res.body, { following: false });
});

test.serial('DEL /follow/:profileId : unfollow a blocked user ', async (t) => {
    await authedRequest('post', `/follow/${t.context.publicUser._id}/block`, t.context.authenticatedUser);

    const res = await authedRequest('del', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    const Rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: 'block',
    });

    t.is(res.status, 200);
    t.truthy(Rel);
    t.deepEqual(res.body, { following: false });
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.publicUser._id);
    await cleanUser(t.context.privateUser._id);
});
