#!/usr/bin/env node

import 'dotenv/config';

import '../config/database';

import User from '../models/user';

const init = async () => {
    try {
        const users = await User.find();

        for (const e of users) {
            if (typeof e.admin === 'Boolean') {
                e.admin = e.admin ? 1 : 0;

                await User.updateOne({ _id: e._id }, { $set: { admin: e.admin } });
            }
        }

        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};

init();
