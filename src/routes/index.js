import express from 'express';

import previewToken from './preview-token';
import activity from './activity';
import admin from './admin';
import auth from './auth';
import feed from './feed';
import follow from './follow';
import reaction from './reaction';
import recommendations from './recommendations';
import report from './report';
import status from './status';
import twohat from './twohat';
import user from './user';
import invite from './invite';

const router = express.Router();

activity(router);
admin(router);
auth(router);
feed(router);
follow(router);
reaction(router);
recommendations(router);
report(router);
status(router);
twohat(router);
user(router);
previewToken(router);
invite(router);

export default router;
