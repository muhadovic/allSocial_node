import test from 'ava';
import request from 'supertest';
import api from '../../src/api';

test('GET /status: basic check', async (t) => {
    const response = await request(api).get('/status');
    t.is(response.status, 200);
    t.deepEqual(response.body, {
        code: 200,
        status: 'OK',
    });
});
