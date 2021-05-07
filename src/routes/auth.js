import Auth from '../controllers/auth/route';

export default (api) => {
    api.post('/auth/signup', Auth.signup.validation, Auth.signup.action);
    api.post('/auth/email', Auth.email.validation, Auth.email.action);
    api.get('/auth/verify', Auth.verify.validation, Auth.verify.action);
    api.post('/auth/signin', Auth.signin.validation, Auth.signin.action);
    api.post('/auth/reset-password', Auth.resetPassword.validation, Auth.resetPassword.action);
    api.get('/auth/verify-password', Auth.verifyPassword);
    api.post('/auth/update-password', Auth.updatePassword.validation, Auth.updatePassword.action);
};
