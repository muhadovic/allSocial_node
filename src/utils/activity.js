import twitter from 'twitter-text';

import User from '../models/user';

export function extractHashtags(text) {
    if (!text || !text.includes('#')) return [];

    return twitter
        .extractHashtags(text)
        .map((h) => `hashtag:${h.toLowerCase()}`)
        .filter((v, i, a) => a.indexOf(v) === i);
}

export async function extractMentions(text) {
    if (!text || !text.includes('@')) return { users: {}, targetMentions: [] };

    const mentions = twitter
        .extractMentions(text)
        .map((mention) => mention.toLowerCase())
        .filter((v, i, a) => a.indexOf(v) === i);

    const mentionedUsers = mentions.length ? await User.find({ username: { $in: mentions } }) : [];
    const targetMentions = mentionedUsers.map((user) => `notification:${user._id}`);
    const users = mentionedUsers.reduce((acc, user) => {
        acc[user.username] = user._id;
        return acc;
    }, {});

    return { users, targetMentions };
}
