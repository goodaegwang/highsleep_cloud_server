const express = require('express');
const multer = require('multer');
const upload = multer();
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const genreService = require('../../services/genreService');
const musicService = require('../../services/musicService');
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
    if (commonUtil.isNullParam(req.query.type)) {
      next(createHttpError(400, { message: 'type is missing.' }));
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

    const { offset, limit, type, searchText, orderBy, status } = req.query;

    if (!(status == 'all' || status == 'A' || status == 'D')) {
      next(createHttpError(400, { message: 'Wrong status' }));
    }
    if (!(orderBy == 'titleAsc' || orderBy == 'artistAsc' || orderBy == 'createdAtDesc' || orderBy == 'viewCountDesc')) {
      next(createHttpError(400, { message: 'Wrong orderBy' }));
      return;
    }

    const results = await musicService.getMusics(offset, limit, type, searchText, orderBy, status);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/:musicId', async (req, res, next) => {
  try {
    const result = await musicService.getMusicInfo(req.params.musicId);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/', upload.array('files'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.artist)) {
      next(createHttpError(400, { message: 'artist is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.genre)) {
      next(createHttpError(400, { message: 'genre is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
      return;
    }
    if (!(req.body.status == 'A' || req.body.status == 'D')) {
      next(createHttpError(400, { message: 'status is invalid.' }));
      return;
    }
    if (commonUtil.isNullParam(req.files.length == 2)) {
      next(createHttpError(400, { message: 'files is missing.' }));
      return;
    }

    const genreList = await genreService.getGenreList();

    let isSearchOption = false;

    if (genreList.count == 0) {
      next(createHttpError(400, { message: 'Not found genre.' }));
      return;
    }

    // eslint-disable-next-line array-callback-return
    genreList.items.map((item) => {
      if (req.body.genre == item.name) {
        isSearchOption = true;
      }
    });

    if (!(req.body.genre == 'all' || isSearchOption)) {
      next(createHttpError(400, { message: 'genre is invalid.' }));
      return;
    }

    const { title, artist, genre, status } = req.body;

    let image = null;
    let music = null;

    if (req.files[0].mimetype == 'image/jpeg' || req.files[0].mimetype == 'image/png') {
      image = req.files[0];
      music = req.files[1];
    } else {
      image = req.files[1];
      music = req.files[0];
    }

    const imagePath = `musicImg/${image.originalname}`;
    const musicPath = `music/${music.originalname}`;

    await musicService.addMusic(imagePath, title, artist, musicPath, genre, status);
    await downloadService.uploadFile(imagePath, image.buffer);
    await downloadService.uploadFile(musicPath, music.buffer);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.put('/:musicId', upload.array('files'), async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.artist)) {
      next(createHttpError(400, { message: 'artist is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.body.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
      return;
    }
    if (!(req.body.status == 'A' || req.body.status == 'D')) {
      next(createHttpError(400, { message: 'status is invalid.' }));
      return;
    }
    if (commonUtil.isNullParam(req.files.length == 2)) {
      next(createHttpError(400, { message: 'files is missing.' }));
      return;
    }

    const { title, artist, status } = req.body;

    let image = null;
    let music = null;

    if (req.files[0].mimetype == 'image/jpeg' || req.files[0].mimetype == 'image/png') {
      image = req.files[0];
      music = req.files[1];
    } else {
      image = req.files[1];
      music = req.files[0];
    }

    const musicInfo = await musicService.getMusicInfo(req.params.musicId);

    const imagePath = `musicImg/${image.originalname}`;
    const musicPath = `music/${music.originalname}`;

    await musicService.updateMusic(req.params.musicId, imagePath, title, artist, musicPath, status);
    await downloadService.deleteFile(musicInfo.imagePath);
    await downloadService.deleteFile(musicInfo.musicPath);
    await downloadService.uploadFile(imagePath, image.buffer);
    await downloadService.uploadFile(musicPath, music.buffer);

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

router.delete('/:musicId', async (req, res, next) => {
  try {
    const musicInfo = await musicService.getMusicInfo(req.params.musicId);

    await musicService.deleteMusic(req.params.musicId);
    await downloadService.deleteFile(musicInfo.imagePath);
    await downloadService.deleteFile(musicInfo.musicPath);

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
