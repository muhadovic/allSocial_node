import postAction from './post';
import deleteAction from './delete';
import validation from './validation';

export default {
    post: {
        action: postAction,
        validation,
    },
    delete: {
        action: deleteAction,
        validation,
    },
};
