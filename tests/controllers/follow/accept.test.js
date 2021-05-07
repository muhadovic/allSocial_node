import test from 'ava';
import Boom from 'boom';

import { authedRequest, createUser, cleanUser } from '../../fixtures/auth';
import FollowRelation from '../../../src/models/follow-relation';
import { isFollowing } from '../../../src/utils/feed';

test.before(async (t) => {
    t.context.authenticatedUser = await createUser();
    t.context.privateUser = await createUser({ isPublic: false });
});

test.serial('POST /follow/:profileId/request : throw when no follow request', async (t) => {
    const res = await authedRequest(
        'post',
        `/follow/${t.context.privateUser._id}/request`,
        t.context.authenticatedUser,
    );

    t.is(res.status, Boom.badData().output.statusCode);
});

test.serial('POST /follow/:profileId/request : accept a follow request', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);

    const res = await authedRequest(
        'post',
        `/follow/${t.context.authenticatedUser._id}/request`,
        t.context.privateUser,
    );

    const following = await isFollowing(t.context.authenticatedUser._id, t.context.privateUser._id);
    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'follow',
    });

    t.is(res.status, 200);
    t.truthy(rel);
    t.true(following);
    t.deepEqual(res.body, { follower: 'follow' });
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.privateUser._id);
});
