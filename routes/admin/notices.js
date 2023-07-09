const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const downloadService = require('../../services/downloadService');
const noticesService = require('../../services/noticesService');
const ErrorCode = require('../../models/errorCode');
const logger = require('../../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.query.offset)) {
      next(createHttpError(400, { message: 'offset is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.query.limit)) {
      next(createHttpError(400, { message: 'limit is missing.' }));
      return;
    }
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
      return;
    }
    const results = await noticesService.getNotices(req.query.offset, req.query.limit, req.query.searchText);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/:noticeId', async (req, res, next) => {
  try {
    const result = await noticesService.getNotice(req.params.noticeId);

    res.status(200);
    next(result);
  } catch (err) {
    const is = new ErrorCode(err.message, next);
    if (!is.isNotFound) {
      logger.error(err);
      next(err);
    }
  }
});

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
      return;
    }
    if (req.body.content === undefined) {
      next(createHttpError(400, { message: 'content is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.file)) {
      next(createHttpError(400, { message: 'image is missing.' }));
      return;
    }

    const imagePath = `notices/${req.file.originalname}`;

    await noticesService.addNotice(req.body.title, req.body.content, imagePath);
    await downloadService.uploadFile(imagePath, req.file.buffer);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.put('/:noticeId', upload.single('image'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
      return;
    }
    if (req.body.content === undefined) {
      next(createHttpError(400, { message: 'content is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
      return;
    }
    if (!(req.body.status == 'A' || req.body.status == 'D')) {
      next(createHttpError(400, { message: 'Wrong status' }));
      return;
    }
    if (commonUtil.isNullParam(req.file)) {
      next(createHttpError(400, { message: 'image is missing.' }));
      return;
    }

    const noticeInfo = await noticesService.getNotice(req.params.noticeId);

    const imagePath = `notices/${req.file.originalname}`;

    await noticesService.updateNotice(req.params.noticeId, req.body.title, req.body.content, req.body.status, imagePath);
    await downloadService.deleteFile(noticeInfo.imagePath);
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

router.delete('/:noticeId', async (req, res, next) => {
  try {
    const noticeInfo = await noticesService.getNotice(req.params.noticeId);

    await noticesService.deleteNotice(req.params.noticeId);
    await downloadService.deleteFile(noticeInfo.imagePath);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
