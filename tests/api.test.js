import test from 'ava';
import request from 'supertest';
import api from '../src/api';

test('GET /: basic check', async (t) => {
    const response = await request(api).get('/');
    t.is(response.status, 302);
});
