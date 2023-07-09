const express = require('express');
const router = express.Router();
const config = require('config');
const createHttpError = require('http-errors');
const https = require('https');
const commonUtil = require('../common/commonUtil');
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.query.filePath)) {
      next(createHttpError(400, { message: 'filePath is missing.' }));
      return;
    }

    https.get(`${config.get('server.sens.url')}/${config.get('server.sens.bucketName')}/${req.query.filePath}`, async (file) => {
      res.set('Content-disposition', `attachment; filename=${encodeURI(req.query.filePath)}`);
      file.pipe(res);
    });
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
