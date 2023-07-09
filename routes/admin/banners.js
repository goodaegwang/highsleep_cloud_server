const express = require('express');
const config = require('config');
const createHttpError = require('http-errors');
const multer = require('multer');
const upload = multer();
const bannerService = require('../../services/bannersService');
const commonUtil = require('../../common/commonUtil');
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
    if (!(req.query.status == 'all' || req.query.status == 'P' || req.query.status == 'T')) {
      next(createHttpError(400, { message: 'Wrong status' }));
      return;
    }
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
      return;
    }

    const { offset, limit, status, searchText } = req.query;

    const results = await bannerService.getBanners(offset, limit, status, searchText);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/:bannerId', async (req, res, next) => {
  try {
    const result = await bannerService.getBanner(req.params.bannerId);

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

    const imagePath = `banners/${req.file.originalname}`;

    const { title, content, link, startDate, endDate, seq } = req.body;

    await bannerService.addBanner(title, imagePath, content, link, startDate, endDate, seq);
    await downloadService.uploadFile(imagePath, req.file.buffer);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.put('/:bannerId', upload.single('image'), async (req, res, next) => {
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

    const bannerInfo = await bannerService.getBanner(req.params.bannerId);

    const imagePath = `banners/${req.file.originalname}`;

    const { title, content, link, startDate, endDate, seq } = req.body;

    await bannerService.updateBanner(req.params.bannerId, title, imagePath, content, link, startDate, endDate, seq);
    await downloadService.deleteFile(bannerInfo.imagePath);
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

router.delete('/:bannerId', async (req, res, next) => {
  try {
    const bannerInfo = await bannerService.getBanner(req.params.bannerId);

    await bannerService.deleteBanner(req.params.bannerId);
    await downloadService.deleteFile(bannerInfo.imagePath);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
