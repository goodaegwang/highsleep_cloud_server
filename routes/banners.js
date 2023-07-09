const express = require('express');
const multer = require('multer');
const bannerService = require('../services/bannersService');
const router = express.Router();
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    const results = await bannerService.getBannersAll();

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
