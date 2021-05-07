import Activity from '../controllers/activity/route';

export default (api) => {
    api.post('/activity', Activity.post);
};
