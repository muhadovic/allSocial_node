import test from 'ava';

import { createUser, cleanUser } from '../fixtures/auth';
import admin, { verifyAdminAccess } from '../../src/middleware/admin';
import User from '../../src/models/user';

test.before(async (t) => {
    t.context.user = await createUser();
    t.context.adminUser = await createUser({ admin: 1 });
});

test('Admin middleware is a function', (t) => {
    t.is(typeof admin, 'function');
});

test('verifyAdminAccess should throws without _id', async (t) => {
    await t.throwsAsync(verifyAdminAccess(), { instanceOf: Error });
    await t.throwsAsync(verifyAdminAccess({}), { instanceOf: Error });
});

test('verifyAdminAccess should return false for user', async (t) => {
    const adminAccess = await verifyAdminAccess({ _id: t.context.user._id });
    t.false(adminAccess);
});

test('verifyAdminAccess should return false for non existant user', async (t) => {
    const adminAccess = await verifyAdminAccess({ _id: '507f1f77bcf86cd799439011' });
    t.false(adminAccess);
});

test.serial('verifyAdminAccess should return true for admin', async (t) => {
    const adminAccess = await verifyAdminAccess({ _id: t.context.adminUser._id, admin: t.context.adminUser.admin });
    t.is(adminAccess, 1);
    t.truthy(adminAccess);
});

test.serial('verifyAdminAccess should return false for revoked admin', async (t) => {
    await User.findByIdAndUpdate(t.context.adminUser._id, { admin: 0 });
    const adminAccess = await verifyAdminAccess({ _id: t.context.adminUser._id, admin: t.context.adminUser.admin });

    t.is(adminAccess, 0);
    t.falsy(adminAccess);
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.user._id);
    await cleanUser(t.context.adminUser._id);
});
