import Feed from '../controllers/feed/route';

export default (api) => {
    api.get('/feed/:feedGroup/:feedId', Feed.get.validation, Feed.get.action);
};
