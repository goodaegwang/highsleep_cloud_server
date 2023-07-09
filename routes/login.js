const express = require('express');
const config = require('config');
const router = express.Router();
const createHttpError = require('http-errors');
const logger = require('../common/logger')(__filename);
const commonUtil = require('../common/commonUtil');
const loginService = require('../services/loginService');
const authService = require('../common/authService');
const usersService = require('../services/usersService');

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
    if (commonUtil.isNullParam(req.body.isStayLogin)) {
      next(createHttpError(400, { message: 'isStayLogin is missing.' }));
      return;
    }

    const user = await usersService.getUserInfo(req.body.userId);

    if (user == undefined) {
      next(createHttpError(400, { message: 'Not Found userId.' }));
      return;
    }

    const userPassword = await loginService.getUserInfo(req.body.userId, req.body.password);

    if (userPassword == undefined) {
      next(createHttpError(400, { message: 'Not found password.' }));
      return;
    }

    const authorizationHeader = req.get('Authorization');

    if (authorizationHeader === undefined) {
      next(createHttpError(400, { message: 'No authentication given.' }));
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
      next(createHttpError(400, { message: 'clientSecret is not matched.' }));
      return;
    }

    const results = await authService.getToken(req.body.userId, req.body.password);
    await loginService.addAccessToken(req.body.userId, results.accessToken, results.refreshToken);
    await loginService.updateIsStayLoginYN(req.body.userId, req.body.isStayLogin);

    res.status(200);
    next({
      accessToken: results.accessToken,
      refreshToken: results.refreshToken,
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
