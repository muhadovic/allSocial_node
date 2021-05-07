#!/usr/bin/env node

import 'dotenv/config';

import '../config/database';
import algoliaIndex from '../config/algolia';

import User from '../models/user';

const getAllAlgoliaUsers = async () => {
    try {
        const hitsPerPage = 1000;
        let algoliaUsers = [];

        const getPagedUsers = async (page = 0) => {
            const algoliaPagedUsers = await algoliaIndex.browse({ hitsPerPage, page });

            algoliaUsers = [...algoliaUsers, ...algoliaPagedUsers.hits];

            if (algoliaPagedUsers.hits.length >= hitsPerPage) {
                await getPagedUsers(++page);
            }
        };

        await getPagedUsers();

        return algoliaUsers;
    } catch (err) {
        process.exit(1);
    }
};

const init = async () => {
    try {
        const algoliaUsers = await getAllAlgoliaUsers();
        const dbUsers = await User.find({}, '_id name username');

        for (const e of dbUsers) {
            const userId = e._id.toString();
            const algoliaUser = algoliaUsers.find((f) => f.id === userId);

            await algoliaIndex.partialUpdateObject({
                objectID: algoliaUser.objectID,
                username: e.username,
            });

            await User.updateOne({ _id: userId }, { $set: { algoliaId: algoliaUser.objectID } });
        }

        process.exit();
    } catch (err) {
        process.exit(1);
    }
};

init();
