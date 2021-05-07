import test from 'ava';

import { authedRequest, createUser, cleanUser } from '../../fixtures/auth';
import FollowRelation from '../../../src/models/follow-relation';

test.before(async (t) => {
    t.context.authenticatedUser = await createUser();
    t.context.privateUser = await createUser({ isPublic: false });
});

test.serial('DEL /follow/:profileId/request : reject when no follow request', async (t) => {
    const res = await authedRequest('del', `/follow/${t.context.privateUser._id}/request`, t.context.authenticatedUser);

    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'request',
    });

    t.is(rel, null);

    t.is(res.status, 204);
});

test.serial('DEL /follow/:profileId/request : reject a follow request', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}/request`, t.context.authenticatedUser);

    const res = await authedRequest('del', `/follow/${t.context.privateUser._id}/request`, t.context.authenticatedUser);

    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'request',
    });

    t.is(rel, null);

    t.is(res.status, 204);
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.privateUser._id);
});
