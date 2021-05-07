import User from '../controllers/user/route';

export default (api) => {
    api.get('/profile/:profileId', User.getProfile);
    api.get('/user', User.get);
    api.delete('/user', User.del);
    api.put('/user', User.put.validation, User.put.action);
    api.put('/user/password', User.password.validation, User.password.action);
};
