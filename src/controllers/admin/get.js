import { wrap } from '../base';

import User from '../../models/user';

const escape = (str) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

export default wrap(async (req) => {
    const { _id, email, username, name, admin, flagged, verified, createdAt, updatedAt, per_page, page } = req.query;
    const skip = (page ? page - 1 : 0) * per_page;
    const search = {};

    if (_id) {
        search._id = _id;
    }

    if (email) {
        search.email = new RegExp(escape(email), 'i');
    }

    if (username) {
        search.username = new RegExp(escape(username), 'i');
    }

    if (name) {
        search.name = new RegExp(escape(name), 'i');
    }

    if (admin || admin === 0) {
        search.admin = admin;
    }

    if (flagged) {
        search.flagged = flagged;
    }

    if (verified || verified === false) {
        search.verified = verified;
    }

    if (createdAt) {
        search.createdAt = createdAt;
    }

    if (updatedAt) {
        search.updatedAt = updatedAt;
    }

    const users = (await User.aggregate([
        {
            $facet: {
                data: [{ $match: search }, { $skip: skip }, { $limit: per_page }],
                count: [{ $match: search }, { $count: 'count' }],
            },
        },
    ]))[0];

    const total = users.count.length ? users.count[0].count : 0;

    return { users: users.data, total };
});
