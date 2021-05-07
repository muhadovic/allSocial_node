import validator from 'validator';

export const isMongoId = (value) => {
    if (!validator.isMongoId(value)) {
        throw new Error('Invalid user id.');
    }

    return true;
};
