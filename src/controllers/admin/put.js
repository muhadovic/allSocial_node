import Boom from 'boom';

import { getStreamClient } from '../../config/stream';
import algoliaIndex from '../../config/algolia';
import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const {
        params: { id },
        body: { name, username, email, admin, flagged, password, bio },
    } = req;

    const user = {};

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
        throw Boom.conflict('No user exists with that id.');
    }

    if (name) {
        user.name = name;
    }

    if (username) {
        user.username = username;
    }

    if (email) {
        user.email = email;
    }

    if (password) {
        user.hash = password;
    }

    if (admin || admin === 0) {
        user.admin = admin;
    }

    if (flagged) {
        user.flagged = flagged;
    }

    if (password) {
        user.tokenSecret = await userToUpdate.generateTokenSecret();
    }

    const updatedUser = await User.findOneAndUpdate({ _id: id }, user, {
        new: true,
        projection: {
            __v: 0,
            hash: 0,
            streamToken: 0,
            algoliaId: 0,
            emailToken: 0,
            passwordResetToken: 0,
            tokenSecret: 0,
        },
    });

    let { algoliaId } = updatedUser;

    if (!algoliaId) {
        const disconnectedAlgoliaUser = await algoliaIndex.search({
            query: updatedUser._id,
        });

        if (disconnectedAlgoliaUser.hits.length) {
            algoliaId = disconnectedAlgoliaUser.hits[0].objectID;

            await User.updateOne({ _id: updatedUser._id }, { algoliaId });
        }
    }

    if (algoliaId) {
        const algoliaUser = { objectID: algoliaId };

        if (updatedUser.name) {
            algoliaUser.name = updatedUser.name;
        }

        if (updatedUser.username) {
            algoliaUser.username = updatedUser.username;
        }

        await algoliaIndex.partialUpdateObject(algoliaUser);
    }

    const streamClient = getStreamClient();
    const streamUser = await streamClient.user(id).get();

    if (bio || bio === '') {
        streamUser.data.bio = bio;
    }

    await streamClient.user(id).update({
        ...streamUser.data,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
    });

    return {
        status: 'User has been successfully updated.',
        user: updatedUser,
    };
});
