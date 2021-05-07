import axios from 'axios';
import btoa from 'btoa';

const key = btoa(`:${process.env.TWO_HAT_KEY}`);

const twoHat = (path, data) => {
    if (!path) throw new Error('Path is a required field.');
    if (!data) throw new Error('Data is a required field.');

    return axios({
        method: 'POST',
        url: `${process.env.TWO_HAT_URL}/${path}`,
        data: { ...data, env: process.env.DOMAIN_API },
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${key}`,
            Connection: 'Keep-Alive',
        },
    });
};

export default twoHat;
