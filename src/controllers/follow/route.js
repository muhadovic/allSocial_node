import getAction from './get';
import getValidation from './get.validation';
import postAction from './post';
import postValidation from './post.validation';
import deleteAction from './delete';
import deleteValidation from './delete.validation';
import listAction from './list';
import listValidation from './list.validation';
import acceptAction from './accept';
import acceptValidation from './accept.validation';
import rejectAction from './reject';
import rejectValidation from './reject.validation';
import blockAction from './block';
import blockValidation from './block.validation';
import unblockAction from './unblock';
import unblockValidation from './unblock.validation';

export default {
    get: {
        action: getAction,
        validation: getValidation,
    },
    post: {
        action: postAction,
        validation: postValidation,
    },
    delete: {
        action: deleteAction,
        validation: deleteValidation,
    },
    list: {
        action: listAction,
        validation: listValidation,
    },
    accept: {
        action: acceptAction,
        validation: acceptValidation,
    },
    reject: {
        action: rejectAction,
        validation: rejectValidation,
    },
    block: {
        action: blockAction,
        validation: blockValidation,
    },
    unblock: {
        action: unblockAction,
        validation: unblockValidation,
    },
};
