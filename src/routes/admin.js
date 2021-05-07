import Admin from '../controllers/admin/route';
import Explore from '../controllers/explore/route';
import UserBan from '../controllers/user-ban/route';
import { isModerator } from '../utils/validation/index';

export default (api) => {
    api.get('/admin/users', Admin.get.validation, Admin.get.action);
    api.put('/admin/user/:id', Admin.put.validation, Admin.put.action);
    api.delete('/admin/user/:id', Admin.delete.validation, Admin.delete.action);
    api.delete('/admin/activity', isModerator, Admin.deleteActivity.validation, Admin.deleteActivity.action);

    api.post('/admin/explore', isModerator, Explore.post.validation, Explore.post.action);
    api.delete('/admin/explore', isModerator, Explore.delete.validation, Explore.delete.action);

    api.post('/admin/ban', isModerator, UserBan.post.validation, UserBan.post.action);
    api.delete('/admin/ban/:userId', isModerator, UserBan.delete.validation, UserBan.delete.action);
};
