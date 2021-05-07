import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

export const BannedEmailSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { collection: 'bannedEmail' },
);

BannedEmailSchema.plugin(timestamps);

export default mongoose.model('bannedEmail', BannedEmailSchema, 'bannedEmail');
