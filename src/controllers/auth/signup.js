import Boom from 'boom';

import { getStreamClient } from '../../config/stream';
import algoliaIndex from '../../config/algolia';
import { sendSignupEmail } from '../../utils/email/send';
import { wrap } from '../base';

import User from '../../models/user';
import FollowRelation from '../../models/follow-relation';
import BannedEmail from '../../models/banned-email';

export default wrap(async (req) => {
    const { name, username, email, password } = req.body;

    const bannedEmail = await BannedEmail.findOne({ email }).lean();

    if (bannedEmail) {
        throw Boom.notFound('This email is banned from using our services.');
    }

    const user = new User({ name, username, email, hash: password });

    user.tokenSecret = await user.generateTokenSecret();

    const userId = user._id.toString();
    user.algoliaId = userId; // Backward compatibility for users without objectID

    const streamClient = getStreamClient();

    await Promise.all([
        user.save(),
        streamClient.user(userId).getOrCreate({
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            profileImage: '',
            bio: '',
            dob: '',
            gender: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            isPublic: true,
        }),
        algoliaIndex.addObject({
            objectID: userId,
            id: userId,
            name: user.name,
            username: user.username,
            type: 'user',
        }),
        streamClient.feed('timeline', userId).follow('user', userId),
        FollowRelation.create({ follower: userId, following: userId, status: 'follow' }),
        sendSignupEmail(user.email, user.emailToken),
    ]);

    const token = await user.generateJWToken();

    return token;
});
