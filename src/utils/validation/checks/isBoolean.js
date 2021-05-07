export const isBoolean = (value, { path }) => {
    if (typeof value !== 'boolean') {
        throw new Error(`${path} must be a boolean.`);
    }

    return true;
};
