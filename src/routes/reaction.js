import Reaction from '../controllers/reaction/route';

export default (api) => {
    api.get('/reaction', Reaction.get.validation, Reaction.get.action);
    api.post('/reaction', Reaction.post.validation, Reaction.post.action);
};
