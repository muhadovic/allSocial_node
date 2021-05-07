import Report from '../controllers/report/route';

export default (api) => {
    api.post('/report', Report.post.validation, Report.post.action);
};
