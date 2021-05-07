import { createHash } from 'crypto';

const md5Hash = (data) => {
    return createHash('md5')
        .update(data)
        .digest('hex');
};

export { md5Hash };
