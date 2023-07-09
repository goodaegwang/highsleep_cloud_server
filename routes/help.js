const express = require('express');
const createHttpError = require('http-errors');
const router = express.Router();
const helpService = require('../services/helpService');
const commonUtil = require('../common/commonUtil');
const logoutService = require('../services/logoutService');
const logger = require('../common/logger')(__filename);

router.post('/idInquery', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.name)) {
      next(createHttpError(400, { message: 'name is missing.' }));
      return;
    }
    let user = await helpService.findUserByNameAndPhone(req.body.name, '');

    if (user.length === 0) {
      res.status(400);
      next({ message: 'Not found user name.' });
      return;
    }

    if (commonUtil.isNullParam(req.body.phone)) {
      next(createHttpError(400, { message: 'phone is missing.' }));
      return;
    }
    user = await helpService.findUserByNameAndPhone(req.body.name, req.body.phone);

    if (user.length === 0) {
      res.status(400);
      next({ message: 'Not found phone number.' });
      return;
    }

    const result = await commonUtil.sendSMS(req.body.phone);

    const resultLen = user[0].user_id.length;
    const id = user[0].user_id.substring(0, resultLen - 3);
    // eslint-disable-next-line quotes, prefer-template
    const userId = id + "***";

    res.status(200);
    next({ authNumber: result.authNumber, userId });

  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/pwInquery', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.userId)) {
      next(createHttpError(400, { message: 'userId is missing.' }));
      return;
    }
    let user = await helpService.findUserByUserIdAndNameAndPhone(req.body.userId, '', '');

    if (user.length === 0) {
      res.status(400);
      next({ message: 'Not found userId.' });
      return;
    }

    if (commonUtil.isNullParam(req.body.name)) {
      next(createHttpError(400, { message: 'name is missing.' }));
      return;
    }
    user = await helpService.findUserByUserIdAndNameAndPhone(req.body.userId, req.body.name, '');

    if (user.length === 0) {
      res.status(400);
      next({ message: 'Not found user name.' });
      return;
    }

    if (commonUtil.isNullParam(req.body.phone)) {
      next(createHttpError(400, { message: 'phone is missing.' }));
      return;
    }
    user = await helpService.findUserByUserIdAndNameAndPhone(req.body.userId, req.body.name, req.body.phone);

    if (user.length === 0) {
      res.status(400);
      next({ message: 'Not found phone number.' });
    }

    const result = await commonUtil.sendSMS(req.body.phone);

    res.status(200);
    next(result);

  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.patch('/pwInquery', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.userId)) {
      next(createHttpError(400, { message: 'userId is missing.' }));
      return;
    }

    if (commonUtil.isNullParam(req.body.password)) {
      next(createHttpError(400, { message: 'password is missing.' }));
      return;
    }

    await helpService.updatePassword(req.body.userId, req.body.password);

    await logoutService.logout(req.body.userId);

    res.status(204);
    next({});

  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
