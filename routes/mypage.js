const express = require('express');
const createHttpError = require('http-errors');
const commonUtil = require('../common/commonUtil');
const devicesService = require('../services/devicesService');
const usersService = require('../services/usersService');
const router = express.Router();
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    const result = await usersService.getUserInfo(req.userId);

    res.status(200);
    next(result == undefined ? {} : result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.patch('/', async (req, res, next) => {
  try {
    if (req.body.phone === undefined && req.body.birthday === undefined && req.body.password === undefined) {
      next(createHttpError(400, { message: 'No data in the parameter' }));
    }

    await usersService.updateUserInfo(req.userId, req.body.phone, req.body.birthday, req.body.password);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/message', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.phone)) {
      next(createHttpError(400, { message: 'phone is missing.' }));
    }

    const result = await commonUtil.sendSMS(req.body.phone);

    res.status(200);
    next({ authNumber: result.authNumber });
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/devices', async (req, res, next) => {
  try {
    const results = await devicesService.getDevices(req.userId);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.delete('/devices/:deviceId', async (req, res, next) => {
  try {
    await devicesService.deleteDevice(req.params.deviceId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
