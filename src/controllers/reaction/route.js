import postAction from './post';
import postValidation from './post.validation';
import getAction from './get';
import getValidation from './get.validation';

export default {
    post: {
        action: postAction,
        validation: postValidation,
    },
    get: {
        action: getAction,
        validation: getValidation,
    },
};
