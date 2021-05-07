import Boom from 'boom';

import { sendResetPasswordEmail } from '../../utils/email/send';
import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw Boom.conflict('User with that email does not exist.');
    }

    const passwordResetToken = user.generatePasswordToken();

    await Promise.all([user.updateOne({ passwordResetToken }), sendResetPasswordEmail(user.email, passwordResetToken)]);

    return { response: 'Password reset email has been sent.' };
});
