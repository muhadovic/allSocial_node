#!/usr/bin/env node

import 'dotenv/config';

import '../config/database';

import User from '../models/user';

const init = async () => {
    try {
        await User.updateMany({}, { $set: { verified: true } });

        process.exit();
    } catch (err) {
        process.exit(1);
    }
};

init();
