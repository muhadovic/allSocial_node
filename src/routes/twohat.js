import Admin from '../controllers/admin/route';
import UserBan from '../controllers/user-ban/route';
import Report from '../controllers/report/route';
import { isTwoHat } from '../utils/validation/index';

export default (api) => {
    api.post('/twohat/delete-activity', isTwoHat, Admin.deleteActivity.validation, Admin.deleteActivity.action);
    api.post('/twohat/delete-report', isTwoHat, Report.delete.validation, Report.delete.action);

    api.post('/twohat/ban', isTwoHat, UserBan.post.validation, UserBan.post.action);
    api.delete('/twohat/ban/:userId', isTwoHat, UserBan.delete.validation, UserBan.delete.action);
};
