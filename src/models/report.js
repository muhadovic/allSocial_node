import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import autopopulate from 'mongoose-autopopulate';
import mongooseStringQuery from 'mongoose-string-query';

export const ReportSchema = new Schema(
    {
        reportingUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true,
            autopopulate: {
                select: ['name', 'email', 'username'],
            },
        },
        reportedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            index: true,
            autopopulate: {
                select: ['name', 'email', 'username'],
            },
        },
        activityId: {
            type: String,
            index: true,
            required: true,
            trim: true,
        },
        activityVerb: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { collection: 'reports' },
);

ReportSchema.plugin(autopopulate);
ReportSchema.plugin(timestamps);
ReportSchema.plugin(mongooseStringQuery);

export default mongoose.model('report', ReportSchema, 'report');
