import getAction from './get';
import getValidation from './get.validation';
import putAction from './put';
import putValidation from './put.validation';
import deleteAction from './delete';
import deleteValidation from './delete.validation';
import deleteActivityAction from './deleteActivity';
import deleteActivityValidation from './deleteActivity.validation';

export default {
    get: {
        action: getAction,
        validation: getValidation,
    },
    put: {
        action: putAction,
        validation: putValidation,
    },
    delete: {
        action: deleteAction,
        validation: deleteValidation,
    },
    deleteActivity: {
        action: deleteActivityAction,
        validation: deleteActivityValidation,
    },
};
