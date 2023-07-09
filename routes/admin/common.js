const express = require('express');
const createHttpError = require('http-errors');
const multer = require('multer');
const commonUtil = require('../../common/commonUtil');
const ErrorCode = require('../../models/errorCode');
const upload = multer();
const router = express.Router();
const commonService = require('../../services/commonService');
const downloadService = require('../../services/downloadService');
const logger = require('../../common/logger')(__filename);

router.get('/images', async (req, res, next) => {
  try {
    const results = await commonService.getCommonImages();

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/images', upload.single('image'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.name)) {
      next(createHttpError(400, { message: 'name is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.file)) {
      next(createHttpError(400, { message: 'image is missing.' }));
      return;
    }

    const imagePath = `common/${req.file.originalname}`;

    await commonService.addCommonImage(req.body.name, imagePath);
    await downloadService.uploadFile(imagePath, req.file.buffer);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.patch('/images/:imageNo', upload.single('image'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.file)) {
      next(createHttpError(400, { message: 'image is missing.' }));
      return;
    }

    const imageInfo = await commonService.getCommonImage(req.params.imageNo);

    const imagePath = `common/${req.file.originalname}`;

    await commonService.updateCommonImage(req.params.imageNo, imagePath);
    await downloadService.deleteFile(imageInfo.imagePath);
    await downloadService.uploadFile(imagePath, req.file.buffer);

    res.status(204);
    next({});
  } catch (err) {
    const is = new ErrorCode(err.message, next);
    if (!is.isNotFound) {
      logger.error(err);
      next(err);
    }
  }
});

router.delete('/images/:imageNo', async (req, res, next) => {
  try {
    const imageInfo = await commonService.getCommonImage(req.params.imageNo);

    await commonService.deleteCommonImage(req.params.imageNo);
    await downloadService.deleteFile(imageInfo.imagePath);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
