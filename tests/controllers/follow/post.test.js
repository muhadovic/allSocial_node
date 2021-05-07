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

test.serial('POST /follow/:profileId : basic follow request to PUBLIC profile', async (t) => {
    const res = await authedRequest('post', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    const following = await isFollowing(t.context.authenticatedUser._id, t.context.publicUser._id);
    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.publicUser._id,
        status: 'follow',
    });

    t.is(res.status, 200);
    t.truthy(rel);
    t.truthy(following);
    t.deepEqual(res.body, { following: 'follow' });
});

test.serial('POST /follow/:profileId : basic follow request to PRIVATE profile', async (t) => {
    const res = await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);

    const following = await isFollowing(t.context.authenticatedUser._id, t.context.privateUser._id);
    const rel = await FollowRelation.findOne({
        follower: t.context.authenticatedUser._id,
        following: t.context.privateUser._id,
        status: 'request',
    });

    t.is(res.status, 200);
    t.truthy(rel);
    t.false(following);
    t.deepEqual(res.body, { following: 'request' });
});

test.serial('POST /follow/:profileId : follow request to blocked PUBLIC profile', async (t) => {
    await authedRequest('post', `/follow/${t.context.publicUser._id}/block`, t.context.authenticatedUser);

    const res = await authedRequest('post', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    t.is(res.status, Boom.conflict().output.statusCode);
});

test.serial('POST /follow/:profileId : follow request to blocked PRIVATE profile', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}/block`, t.context.authenticatedUser);

    const res = await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);

    t.is(res.status, Boom.conflict().output.statusCode);
});

test.serial('POST /follow/:profileId : follow request to PUBLIC profile blocking user', async (t) => {
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}/block`, t.context.publicUser);

    const res = await authedRequest('post', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    t.is(res.status, Boom.conflict().output.statusCode);
});

test.serial('POST /follow/:profileId : follow request to PRIVATE profile blocking user', async (t) => {
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}/block`, t.context.privateUser);

    const res = await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);

    t.is(res.status, Boom.conflict().output.statusCode);
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.publicUser._id);
    await cleanUser(t.context.privateUser._id);
});
