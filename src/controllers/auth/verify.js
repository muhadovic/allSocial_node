import Boom from 'boom';

import { wrap, Redirect } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const emailToken = req.query.verifyToken;

    const user = await User.findOneAndUpdate({ emailToken }, { verified: true }, { new: true });

    if (!user) {
        throw Boom.notFound('No user found for that link.');
    }

    return new Redirect(`http://${process.env.DOMAIN}`);
});
