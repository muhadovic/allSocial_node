import postAction from './post';
import postValidation from './post.validation';
import deleteAction from './delete';
import deleteValidation from './delete.validation';

export default {
    post: {
        action: postAction,
        validation: postValidation,
    },
    delete: {
        action: deleteAction,
        validation: deleteValidation,
    },
};
