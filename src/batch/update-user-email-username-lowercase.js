#!/usr/bin/env node

import 'dotenv/config';

import '../config/database';

import User from '../models/user';

const init = async () => {
    try {
        const users = await User.find();

        for (const e of users) {
            const email = e.email.toLowerCase();
            const username = e.username.toLowerCase();

            await User.updateOne({ _id: e._id }, { $set: { email, username } });
        }

        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};

init();
