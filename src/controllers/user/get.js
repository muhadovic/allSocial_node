import User from '../../models/user';
import { wrap } from '../base';

export default wrap(async (req) => {
    const { _id } = req.user;
    const user = await User.findById(_id, '_id email username name verified admin');

    return user;
});
