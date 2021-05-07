import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import autopopulate from 'mongoose-autopopulate';

export const FollowRelationSchema = new Schema(
    {
        follower: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true,
            autopopulate: {
                select: ['name', 'email', 'username'],
            },
        },
        following: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true,
            autopopulate: {
                select: ['name', 'email', 'username'],
            },
        },
        status: {
            type: String,
            required: true,
            default: 'request',
            lowercase: true,
            enum: ['follow', 'request', 'block'],
        },
    },
    { collection: 'followRelation' },
);

FollowRelationSchema.index({ follower: 1, following: 1 }, { unique: true });

FollowRelationSchema.plugin(autopopulate);
FollowRelationSchema.plugin(timestamps);

export default mongoose.model('followRelation', FollowRelationSchema, 'followRelation');
