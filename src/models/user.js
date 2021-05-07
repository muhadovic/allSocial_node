import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';
import nanoid from 'nanoid/async';

import FollowRelation from './follow-relation';
import TimedPost from './timed-post';
import Report from './report';
import redis from '../config/redis';
import algoliaIndex from '../config/algolia';
import { getStreamClient } from '../config/stream';
import { unfollowDeletedUser } from '../utils/stream';
import logger from '../config/logger';

const jwtSign = (payload, expiresIn, tokenSecret = '') => {
    return jwt.sign(payload, `${process.env.JWT_SECRET}${tokenSecret}`, expiresIn ? { expiresIn } : {});
};

export const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        trim: true,
    },
    admin: {
        type: Number,
        default: 0,
    },
    flagged: {
        type: Boolean,
        default: false,
    },
    flaggedAt: {
        type: Date,
    },
    unflagAt: {
        type: Date,
    },
    algoliaId: {
        type: String,
        default: '',
    },
    passwordResetToken: {
        type: String,
        default: '',
    },
    hash: {
        type: String,
        bcrypt: true,
    },
    emailToken: {
        type: String,
        unique: true,
        default() {
            return jwtSign({ _id: this._id.toString() }, '2 days');
        },
    },
    verified: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        default: '',
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
    tokenSecret: {
        type: String,
        default: '',
    },
});

UserSchema.methods.generateTokenSecret = async function() {
    this.tokenSecret = await nanoid();

    await redis.set(`tokenSecret:${this._id.toString()}`, this.tokenSecret);

    return this.tokenSecret;
};

UserSchema.methods.deleteTokenSecret = async function() {
    await redis.del(`tokenSecret:${this._id.toString()}`);
};

UserSchema.methods.generateJWToken = async function(exp = '180 days', extra) {
    const admin = this.admin ? { admin: this.admin } : {};
    const isPreviewToken = this.username === 'preview' ? { isPreviewToken: true } : {};
    const appToken = jwtSign(
        { _id: this._id, jti: await nanoid(), ...admin, ...isPreviewToken },
        exp,
        this.tokenSecret,
    );
    const streamToken = getStreamClient().createUserToken(this._id.toString(), extra);

    return {
        appToken,
        streamToken,
        username: this.username,
        name: this.name,
        admin: this.admin,
        flagged: this.flagged,
        algoliaId: this.algoliaId || this._id.toString(),
        verified: this.verified,
    };
};

UserSchema.methods.generatePasswordToken = function() {
    return jwtSign({ _id: this._id }, '2 hours');
};

UserSchema.post('remove', async function(user) {
    try {
        const promises = await Promise.all([
            TimedPost.remove({ user }),
            FollowRelation.remove({ $or: [{ follower: user }, { following: user }] }),
            Report.remove({ reportedUser: user }),
            user.deleteTokenSecret(),
            unfollowDeletedUser(user._id),
            algoliaIndex.deleteObject(user.algoliaId || user._id.toString()),
            getStreamClient()
                .user(user._id)
                .delete(),
        ]);

        logger.info('UserDelete', { user, promises });
    } catch (err) {
        logger.error('UserDelete', { user, err });
    }
});

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);
UserSchema.plugin(bcrypt);

export default mongoose.model('users', UserSchema);
