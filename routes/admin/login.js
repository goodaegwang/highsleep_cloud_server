const express = require('express');
const config = require('config');
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const authService = require('../../common/authService');
const loginService = require('../../services/loginService');
const router = express.Router();
const logger = require('../../common/logger')(__filename);

router.post('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.userId)) {
      next(createHttpError(400, { message: 'userId is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.password)) {
      next(createHttpError(400, { message: 'password is missing.' }));
      return;
    }

    const authorizationHeader = req.get('Authorization');

    if (authorizationHeader === undefined) {
      next(createHttpError(400, { message: 'No authentication given.' }));
      return;
    }

    const IsAdminId = req.body.userId == config.get('server.admin.id');
    const IsAdminPw = req.body.password == config.get('server.admin.pw');

    if (!(IsAdminId && IsAdminPw)) {
      next(createHttpError(400, { message: 'Not Admin.' }));
      return;
    }

    const basicHeader = authorizationHeader.split('Basic ')[1];
    const decodedBasicToken = Buffer.from(basicHeader, 'base64').toString('utf-8');
    const clientId = decodedBasicToken.split(':')[0];
    const clientSecret = decodedBasicToken.split(':')[1];

    if (commonUtil.isNullParam(clientId)) {
      next(createHttpError(400, { message: 'clientId is missing.' }));
      return;
    }
    if (clientId != config.get('server.clientId')) {
      next(createHttpError(400, { message: 'clientId is not matched.' }));
      return;
    }
    if (commonUtil.isNullParam(clientSecret)) {
      next(createHttpError(400, { message: 'clientSecret is missing.' }));
      return;
    }
    if (clientSecret != config.get('server.clientSecret')) {
      next(createHttpError(400, { message: 'clinetSecret is not matched.' }));
      return;
    }

    const results = await authService.getToken(req.body.userId, req.body.password);
    await loginService.addAdminAccessToken(req.body.userId, results.accessToken);

    res.status(200);
    next({
      accessToken: results.accessToken,
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
