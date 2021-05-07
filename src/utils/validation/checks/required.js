export const required = (value, { path }) => {
    if (value === undefined) {
        throw new Error(`The ${path} field must exist.`);
    }

    return true;
};
