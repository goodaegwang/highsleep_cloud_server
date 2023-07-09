const express = require('express');
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const dashboardService = require('../../services/dashboardService');
const router = express.Router();
const logger = require('../../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    const result = await dashboardService.getUserAndDeviceCount();

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/subscriptionStatistics', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.query.period)) {
      next(createHttpError(400, { message: 'period is missing.' }));
      return;
    }
    if (!(req.query.period == 'day' || req.query.period == 'week' || req.query.period == 'month' || req.query.period == 'year')) {
      next(createHttpError(400, { message: 'Wrong period' }));
      return;
    }

    const result = await dashboardService.getSubscriptionStatistics(req.query.period);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/subscriptionStatus', async (req, res, next) => {
  try {
    const result = await dashboardService.getSubscriptionStatus();

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
