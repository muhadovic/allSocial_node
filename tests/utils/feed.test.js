import test from 'ava';
import { isFollowing, isPublicProfile } from '../../src/utils/feed';

import { authedRequest, createUser, cleanUser } from '../fixtures/auth';

test.before(async (t) => {
    t.context.authenticatedUser = await createUser();
    t.context.publicUser = await createUser();
    t.context.privateUser = await createUser({ isPublic: false });
});

test('isFollowing: throws for non existent user', async (t) => {
    await t.throwsAsync(isFollowing(), { instanceOf: Error });
    await t.throwsAsync(isFollowing('', ''), { instanceOf: Error });
    await t.throwsAsync(isFollowing(t.context.authenticatedUser.id, ''), { instanceOf: Error });
    await t.throwsAsync(isFollowing('', t.context.authenticatedUser.id), { instanceOf: Error });
});

test('isFollowing: public user', async (t) => {
    await authedRequest('post', `/follow/${t.context.publicUser._id}`, t.context.authenticatedUser);

    const following = await isFollowing(t.context.authenticatedUser.id, t.context.publicUser.id);

    t.true(following);
});

test('isFollowing: private user', async (t) => {
    await authedRequest('post', `/follow/${t.context.privateUser._id}`, t.context.authenticatedUser);
    await authedRequest('post', `/follow/${t.context.authenticatedUser._id}/request`, t.context.privateUser);

    const following = await isFollowing(t.context.authenticatedUser.id, t.context.privateUser.id);

    t.true(following);
});

test('isPublicProfile: throws for non existent user', async (t) => {
    await t.throwsAsync(isPublicProfile(), { instanceOf: Error });
    await t.throwsAsync(isPublicProfile(''), { instanceOf: Error });
});

test('isPublicProfile: public user', async (t) => {
    const isPublic = await isPublicProfile(t.context.publicUser.id);

    t.true(isPublic);
});

test('isPublicProfile: private user', async (t) => {
    const isPublic = await isPublicProfile(t.context.privateUser.id);

    t.false(isPublic);
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.publicUser._id);
    await cleanUser(t.context.privateUser._id);
});
