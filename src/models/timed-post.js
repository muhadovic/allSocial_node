import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import autopopulate from 'mongoose-autopopulate';
import mongooseStringQuery from 'mongoose-string-query';

export const TimedPostSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true,
            autopopulate: {
                select: ['name', 'email', 'username'],
            },
        },
        postId: {
            type: String,
            index: true,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
    },
    { collection: 'timedPosts' },
);

TimedPostSchema.plugin(autopopulate);
TimedPostSchema.plugin(timestamps);
TimedPostSchema.plugin(mongooseStringQuery);

export default mongoose.model('timedPosts', TimedPostSchema, 'timedPosts');
