import stream from 'getstream';
import jwt from 'jsonwebtoken';

const createGlobalToken = () => {
    jwt.sign({ action: '*', feed_id: '*', resource: '*', user_id: '*' }, process.env.STREAM_API_SECRET, {
        algorithm: 'HS256',
        noTimestamp: true,
    });
};

let client;

const getStreamClient = () => {
    if (!client) {
        client = stream.connect(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET, process.env.STREAM_APP_ID);
        client._personalizationToken = createGlobalToken();
    }

    return client;
};

export { getStreamClient };
