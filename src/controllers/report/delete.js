import { wrap } from '../base';
import Report from '../../models/report';

export default wrap(async (req) => {
    const data = {
        reportedUser: req.body.userId,
        activityId: req.body.activityId,
    };

    // Remove all the reports of the activity(post||comment)
    const removed = await Report.remove(data);

    return { removed: removed.n };
});
