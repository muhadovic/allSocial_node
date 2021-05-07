import twoHat from '../../../config/twohat';

export const twohat = async (value, { req, path }) => {
    try {
        const { _id } = { ...req.user };
        const data = { user_id: _id || 'newUser' };

        let resource = 'short_text';

        if (path === 'username') {
            data.user_display_name = value;
            resource = 'username';
        } else if (path === 'image' || path === 'profileImage') {
            data.image_src = value;
            resource = 'image';
        } else {
            data.text = value;
        }

        if (value === '') {
            return true;
        }

        const toxic = await twoHat(`fp_check_${resource}`, data);

        if (!toxic.data.response) {
            throw new Error(`Please choose an appropriate ${path}.`);
        }
    } catch (err) {
        return Promise.reject(err);
    }
};
