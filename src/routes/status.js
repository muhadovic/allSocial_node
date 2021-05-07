import Status from '../controllers/status';

export default (api) => {
    api.get('/status', Status.get);
};
