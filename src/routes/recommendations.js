import Recommendations from '../controllers/recommendations/route';

export default (api) => {
    api.get('/recommendations/interest', Recommendations.getInterest.validation, Recommendations.getInterest.action);
    api.get('/recommendations', Recommendations.getFollow);
};
