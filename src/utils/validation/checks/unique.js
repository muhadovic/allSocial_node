import User from '../../../models/user';

export const unique = async (value, { req, path }) => {
    try {
        const { _id } = { ...req.user };
        const { id } = { ...req.params };
        const userExists = await User.findOne({ [path]: value }, '_id');

        if (userExists) {
            const userExistsId = userExists._id.toString();

            if (userExistsId !== _id && userExistsId !== id) {
                throw new Error(`${path} already exists.`);
            }
        }
    } catch (err) {
        return Promise.reject(err);
    }
};
