import { wrap } from '../base';

import User from '../../models/user';

export default wrap(async (req) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    return { exists: !!user };
});
