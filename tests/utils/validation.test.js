import test from 'ava';
import { createUser, cleanUser } from '../fixtures/auth';

import { isTwoHat, isAdmin } from '../../src/utils/validation';

test.before(async (t) => {
    t.context.authenticatedUser = await createUser(null, true);
    t.context.adminUser = await createUser({ admin: 1 }, true);
});

test('isAdmin: prevent access', async (t) => {
    await t.throwsAsync(isAdmin, { instanceOf: Error });

    await t.throwsAsync(
        async () =>
            isAdmin({}, {}, (err) => {
                throw err;
            }),
        { instanceOf: Error },
    );

    await t.throwsAsync(
        async () =>
            isAdmin({ user: { _id: '' } }, {}, (err) => {
                throw err;
            }),
        { instanceOf: Error },
    );

    await t.throwsAsync(
        async () =>
            isAdmin({ user: { _id: '53fbf4615c3b9f41c381b6a3' } }, {}, (err) => {
                throw err;
            }),
        { instanceOf: Error },
    );

    await t.throwsAsync(
        async () =>
            isAdmin({ user: { _id: t.context.authenticatedUser._id } }, {}, (err) => {
                throw err;
            }),
        { instanceOf: Error },
    );
});

test('isAdmin: allow access', async (t) => {
    await t.notThrowsAsync(async () =>
        isAdmin({ user: { _id: t.context.adminUser._id, admin: 1 } }, {}, (err) => {
            if (err) throw err;
        }),
    );
});

test('isTwoHat: prevent access with wrong key', (t) => {
    t.throws(isTwoHat, { instanceOf: TypeError });

    t.throws(
        () => {
            isTwoHat({}, {}, (err) => {
                throw err;
            });
        },
        { instanceOf: TypeError },
    );

    t.throws(
        () => {
            const req = {};
            req[`x-api-key`] = 'r4nd0m';
            isTwoHat({ req }, {}, (err) => {
                throw err;
            });
        },
        { instanceOf: TypeError },
    );
});

test.after.always('cleanup', async (t) => {
    await cleanUser(t.context.authenticatedUser._id);
    await cleanUser(t.context.adminUser._id);
});
