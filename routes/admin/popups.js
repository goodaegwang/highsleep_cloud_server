const express = require('express');
const multer = require('multer');
const upload = multer();
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const popupsService = require('../../services/popupsService');
const downloadService = require('../../services/downloadService');
const ErrorCode = require('../../models/errorCode');
const router = express.Router();
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
    if (commonUtil.isNullParam(req.query.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
      return;
    }
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
      return;
    }

    const { offset, limit, status, searchText } = req.query;

    const results = await popupsService.getPopups(offset, limit, status, searchText);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/:popupId', async (req, res, next) => {
  try {
    const results = await popupsService.getPopup(req.params.popupId);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.startDate)) {
      next(createHttpError(400, { message: 'startDate is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.endDate)) {
      next(createHttpError(400, { message: 'endDate is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.seq)) {
      next(createHttpError(400, { message: 'seq is missing.' }));
      return;
    }
    if (req.body.content === undefined) {
      next(createHttpError(400, { message: 'content is missing.' }));
      return;
    }
    if (req.body.link === undefined) {
      next(createHttpError(400, { message: 'link is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.file)) {
      next(createHttpError(400, { message: 'image is missing.' }));
      return;
    }

    const imagePath = `popups/${req.file.originalname}`;

    const { title, content, link, startDate, endDate, seq } = req.body;

    await popupsService.addPopup(title, imagePath, content, link, startDate, endDate, seq);
    await downloadService.uploadFile(imagePath, req.file.buffer);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.put('/:popupId', upload.single('image'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.startDate)) {
      next(createHttpError(400, { message: 'startDate is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.endDate)) {
      next(createHttpError(400, { message: 'endDate is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.seq)) {
      next(createHttpError(400, { message: 'seq is missing.' }));
      return;
    }
    if (req.body.content === undefined) {
      next(createHttpError(400, { message: 'content is missing.' }));
      return;
    }
    if (req.body.link === undefined) {
      next(createHttpError(400, { message: 'link is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.file)) {
      next(createHttpError(400, { message: 'image is missing.' }));
      return;
    }

    const popupInfo = await popupsService.getPopup(req.params.popupId);

    const imagePath = `popups/${req.file.originalname}`;

    const { title, content, link, startDate, endDate, seq } = req.body;

    await popupsService.updatePopup(req.params.popupId, title, imagePath, content, link, startDate, endDate, seq);
    await downloadService.deleteFile(popupInfo.imagePath);
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

router.delete('/:popupId', async (req, res, next) => {
  try {
    await popupsService.deletePopup(req.params.popupId);

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

module.exports = router;
