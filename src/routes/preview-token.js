import PreviewToken from '../controllers/preview-token/route';

export default (api) => {
    api.get('/preview-token', PreviewToken.get);
};
