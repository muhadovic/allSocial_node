import get from './get';
import del from './delete';
import putAction from './put';
import putValidation from './put.validation';
import passwordAction from './password';
import passwordValidation from './password.validation';
import getProfile from './getProfile';

export default {
    get,
    del,
    getProfile,
    put: {
        action: putAction,
        validation: putValidation,
    },
    password: {
        action: passwordAction,
        validation: passwordValidation,
    },
};
