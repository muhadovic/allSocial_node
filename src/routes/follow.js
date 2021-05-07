import Follow from '../controllers/follow/route';

export default (api) => {
    /* List of all followers/following of a user  */
    api.get('/follow/', Follow.list.validation, Follow.list.action);

    /* get the relationship   */
    api.get('/follow/:profileId', Follow.get.validation, Follow.get.action);
    /* follow || send a follow request */
    api.post('/follow/:profileId', Follow.post.validation, Follow.post.action);
    /* unfollow || delete a follow request */
    api.delete('/follow/:profileId', Follow.delete.validation, Follow.delete.action);

    /* accept a follow request */
    api.post('/follow/:profileId/request', Follow.accept.validation, Follow.accept.action);
    /* reject a follow request */
    api.delete('/follow/:profileId/request', Follow.reject.validation, Follow.reject.action);

    /* block user */
    api.post('/follow/:profileId/block', Follow.block.validation, Follow.block.action);
    /* unblock an user */
    api.delete('/follow/:profileId/block', Follow.unblock.validation, Follow.unblock.action);
};
