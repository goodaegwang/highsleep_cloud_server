const express = require('express');
const multer = require('multer');
const upload = multer();
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const genreService = require('../../services/genreService');
const router = express.Router();
const downloadService = require('../../services/downloadService');
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
    if (commonUtil.isNullParam(req.query.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
      return;
    }
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.query.orderBy)) {
      next(createHttpError(400, { message: 'orderBy is missing.' }));
      return;
    }

    const { offset, limit, status, searchText, orderBy } = req.query;

    if (!(status == 'all' || status == 'A' || status == 'D')) {
      next(createHttpError(400, { message: 'Wrong status' }));
      return;
    }
    if (!(orderBy == 'seqAsc' || orderBy == 'seqDesc' || orderBy == 'genreNameAsc' || orderBy == 'createdAtAsc' || orderBy == 'inquiryDesc')) {
      next(createHttpError(400, { message: 'Wrong orderBy' }));
      return;
    }

    const results = await genreService.getGenres(offset, limit, status, searchText, orderBy);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/:genreNo', async (req, res, next) => {
  try {
    const result = await genreService.getGenre(req.params.genreNo);

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
    if (commonUtil.isNullParam(req.body.name)) {
      next(createHttpError(400, { message: 'name is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.file)) {
      next(createHttpError(400, { message: 'image is missing.' }));
      return;
    }

    const imagePath = `genre/${req.file.originalname}`;

    await genreService.addGenre(req.body.name, req.body.status, imagePath);
    await downloadService.uploadFile(imagePath, req.file.buffer);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.put('/:genreNo', upload.single('image'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.name)) {
      next(createHttpError(400, { message: 'name is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.seq)) {
      next(createHttpError(400, { message: 'seq is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.file)) {
      next(createHttpError(400, { message: 'image is missing.' }));
      return;
    }

    const genreInfo = await genreService.getGenre(req.params.genreNo);

    const imagePath = `genre/${req.file.originalname}`;

    await genreService.updateGenre(req.params.genreNo, req.body.name, Number(req.body.seq), req.body.status, imagePath);
    await downloadService.deleteFile(genreInfo.imagePath);
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

router.delete('/:genreNo', async (req, res, next) => {
  try {
    const genreInfo = await genreService.getGenre(req.params.genreNo);

    await genreService.deleteGenre(req.params.genreNo);
    await downloadService.deleteFile(genreInfo.imagePath);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
