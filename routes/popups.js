const express = require('express');
const popupsService = require('../services/popupsService');
const router = express.Router();
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    const results = await popupsService.getPopupAll();

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
