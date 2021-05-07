import getFollow from './getFollow';
import getInterestAction from './getInterest';
import getInterestValidation from './getInterest.validation';

export default {
    getFollow,
    getInterest: {
        action: getInterestAction,
        validation: getInterestValidation,
    },
};
