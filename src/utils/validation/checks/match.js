import { matches } from 'validator';

export const match = (value, { path }) => {
    let message = `${path} must contain only letters, numbers, spaces and !@#$%&'-,. characters.`;
    let check = /^[a-zA-Z0-9 !$%&?,.'-]*$/;

    if (path === 'username') {
        message = `${path} must contain only letters, numbers and underscores.`;
        check = /^[\w]+$/;
    } else if (path === 'createdAt' || path === 'updatedAt') {
        message = `${path} must be properly formatted.`;
        check = /^([0-9:\-.\s]+)$/;
    }

    if (!matches(value, check)) {
        throw new Error(message);
    }

    return true;
};
