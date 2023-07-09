const express = require('express');
const router = express.Router();
const config = require('config');
const https = require('https');
const createHttpError = require('http-errors');
const commonUtil = require('../common/commonUtil');
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.query.imagePath)) {
      next(createHttpError(400, { message: 'imagePath is missing.' }));
      return;
    }

    https.get(`${config.get('server.sens.url')}/${config.get('server.sens.bucketName')}/musicImg/${req.query.imagePath}`, async (file) => {
      res.set('Content-disposition', `attachment; filename=${encodeURI(req.query.filePath)}`);
      file.pipe(res);
    });
  } catch (err) {
    logger.error(err.message);
    next(err.message);
  }
});

module.exports = router;
