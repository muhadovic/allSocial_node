import test from 'ava';
import Boom from 'boom';

import { authedRequest, createUser, cleanUser } from '../../fixtures/auth';
import FollowRelation from '../../../src/models/follow-relation';

test.before(async (t) => {
    t.context.authenticatedUser = await createUser();
    t.context.someUser = await createUser();
});

test.serial('DEL /follow/:profileId/block : unblock yourself', async (t) => {
    const res = await authedRequest(
        'del',
        `/follow/${t.context.authenticatedUser._id}/block`,
        t.context.authenticatedUser,
    );

    t.is(res.status, Boom.badData().output.statusCode);
});

test.serial('DEL /follow/:profileId/block : unblock a blocked user ', async (t) => {
    await authedRequest('post', `/follow/${t.context.someUser._id}/block`, t.context.authenticatedUser);

    const res = await authedRequest('del', `/follow/${t.context.someUser._id}/block`, t.context.authenticatedUser);

    const blockRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.someUser._id,
        status: 'block',
    });

    t.is(res.status, 204);
    t.is(blockRel, null);
});

test.serial('DEL /follow/:profileId/block : unblock a random user without being actually blocked', async (t) => {
    const res = await authedRequest('del', `/follow/${t.context.someUser._id}/block`, t.context.authenticatedUser);

    const blockRel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.someUser._id,
        status: 'block',
    });

    t.is(res.status, 204);
    t.is(blockRel, null);
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.someUser._id);
});
