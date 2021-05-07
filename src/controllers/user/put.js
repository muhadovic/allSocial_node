import validator from 'validator';

import { getStreamClient } from '../../config/stream';
import algoliaIndex from '../../config/algolia';
import FollowRelation from '../../models/follow-relation';
import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const {
        user: { _id },
        body: {
            name,
            username,
            email,
            bio,
            phone,
            dob,
            gender,
            city,
            state,
            zip,
            country,
            profileImage,
            interests = [],
            isPublic,
            follow = [],
        },
    } = req;

    const promises = [];
    const user = {};

    if (name) {
        user.name = name;
    }

    if (username) {
        user.username = username;
    }

    if (email) {
        user.email = email;
    }

    if (profileImage) {
        user.profileImage = profileImage;
    }

    if (typeof isPublic === 'boolean') {
        user.isPublic = isPublic;
    }

    const updatedUser = await User.findOneAndUpdate({ _id }, user, {
        new: true,
        projection: {
            __v: 0,
            streamToken: 0,
            passwordResetToken: 0,
            hash: 0,
            emailToken: 0,
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

        if (user.profileImage) {
            algoliaUser.profileImage = user.profileImage;
        }

        await algoliaIndex.partialUpdateObject(algoliaUser);
    }

    const streamClient = getStreamClient();
    const streamUser = await streamClient.user(_id).get();

    if (bio || bio === '') {
        streamUser.data.bio = bio;
    }

    if (dob || dob === '') {
        streamUser.data.dob = dob;
    }

    if (gender || gender === '') {
        streamUser.data.gender = gender;
    }

    if (city || city === '') {
        streamUser.data.city = city;
    }

    if (state || state === '') {
        streamUser.data.state = state;
    }

    if (zip || zip === '') {
        streamUser.data.zip = zip;
    }

    if (country || country === '') {
        streamUser.data.country = country;
    }

    if (phone || phone === '') {
        streamUser.data.phone = phone;
    }

    if (follow.length) {
        const follows = [];
        const valid = follow.filter((e, i, a) => typeof e === 'string' && a.indexOf(e) === i);

        if (valid.length) {
            (await User.find(
                {
                    isPublic: { $ne: false },
                    $or: [
                        { username: { $in: valid.filter((e) => !validator.isMongoId(e)) } },
                        { _id: { $in: valid.filter((e) => validator.isMongoId(e)) } },
                    ],
                },
                '_id',
            )).forEach((e) => {
                follows.push({ source: `timeline:${_id}`, target: `user:${e._id}` });
            });
        }

        if (follows.length) {
            promises.push(streamClient.followMany(follows));
            promises.push(
                FollowRelation.insertMany(
                    follows.map((e) => ({
                        follower: e.source.split(':')[1],
                        following: e.target.split(':')[1],
                        status: 'follow',
                    })),
                ),
            );
        }
    }

    if (interests.length) {
        streamUser.data.interests = interests;
    }

    promises.push(
        streamClient.user(_id).update({
            ...streamUser.data,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
            isPublic: updatedUser.isPublic,
        }),
    );

    await Promise.all(promises);

    return {
        status: 'User has been successfully updated.',
        user: updatedUser,
    };
});
