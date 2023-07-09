const express = require('express');
const createHttpError = require('http-errors');
const commonUtil = require('../common/commonUtil');
const devicesService = require('../services/devicesService');
const router = express.Router();
const logger = require('../common/logger')(__filename);

router.post('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.name)) {
      next(createHttpError(400, { message: 'name is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.device)) {
      next(createHttpError(400, { message: 'device is missing.' }));
      return;
    }
    const id = await devicesService.addDevice(req.userId, req.body.name, req.body.device);

    res.status(200);
    next({ id });

  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
