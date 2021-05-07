import Invite from '../controllers/invite/route';

export default (api) => {
    api.post('/invite', Invite.post.validation, Invite.post.action);
};
