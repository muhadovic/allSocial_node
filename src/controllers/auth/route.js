import signupAction from './signup';
import signupValidation from './signup.validation';

import signinAction from './signin';
import signinValidation from './signin.validation';

import verifyAction from './verify';
import verifyValidation from './verify.validation';

import emailAction from './email';
import emailValidation from './email.validation';

import resetPasswordAction from './reset-password';
import resetPasswordValidation from './reset-password.validation';

import verifyPassword from './verify-password';

import updatePasswordAction from './update-password';
import updatePasswordValidation from './update-password.validation';

export default {
    signup: {
        action: signupAction,
        validation: signupValidation,
    },
    signin: {
        action: signinAction,
        validation: signinValidation,
    },
    verify: {
        action: verifyAction,
        validation: verifyValidation,
    },
    email: {
        action: emailAction,
        validation: emailValidation,
    },
    resetPassword: {
        action: resetPasswordAction,
        validation: resetPasswordValidation,
    },
    verifyPassword,
    updatePassword: {
        action: updatePasswordAction,
        validation: updatePasswordValidation,
    },
};
