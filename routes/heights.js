const express = require('express');
const createHttpError = require('http-errors');
const router = express.Router();
const commonUtil = require('../common/commonUtil');
const logger = require('../common/logger')(__filename);
const heightsService = require('../services/heightsService');

router.get('/day', async (req, res, next) => {
  try {
    const result = await heightsService.getHeightPerDay(req.userId);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/month', async (req, res, next) => {
  try {
    const result = await heightsService.getHeightByMonth(req.userId);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.height)) {
      next(createHttpError(400, 'height is missing.'));
      return;
    }
    if (commonUtil.isNullParam(req.body.date)) {
      next(createHttpError(400, 'date is missing.'));
      return;
    }

    if (req.body.date.length != 10) {
      next(createHttpError(400, 'date length is wrong.'));
      return;
    }

    const isDuplicate = await heightsService.getHeight(req.userId, req.body.date);

    if (isDuplicate !== null) {
      next(createHttpError(400, "Can't add data for that date."));
      return;
    }

    const id = await heightsService.addHeight(req.userId, req.body.height, req.body.date);

    res.status(200);
    next({ id });
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.patch('/:heightId', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.height)) {
      next(createHttpError(400, 'height is missing.'));
      return;
    }
    if (commonUtil.isNullParam(req.body.date)) {
      next(createHttpError(400, 'date is missing.'));
      return;
    }

    if (req.body.date.length != 10) {
      next(createHttpError(400, 'date length is wrong.'));
      return;
    }

    const isDuplicate = await heightsService.getHeight(req.userId, req.body.date);

    if (isDuplicate !== null) {
      next(createHttpError(400, "Can't add data for that date."));
      return;
    }

    await heightsService.updateHeight(req.params.heightId, req.body.height, req.body.date);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.delete('/:heightId', async (req, res, next) => {
  try {
    await heightsService.deleteHeight(req.params.heightId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
