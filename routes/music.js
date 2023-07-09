const express = require('express');
const router = express.Router();
const createHttpError = require('http-errors');
const commonUtil = require('../common/commonUtil');
const musicService = require('../services/musicService');
const genreService = require('../services/genreService');
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.query.searchOption)) {
      next(createHttpError(400, { message: 'searchOption is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.query.orderBy)) {
      next(createHttpError(400, { message: 'orderBy is missing.' }));
      return;
    }
    if (!(req.query.orderBy == 'createdAtDesc' || req.query.orderBy == 'popularDesc')) {
      next(createHttpError(400, { message: 'Wrong orderBy.' }));
      return;
    }
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
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
      if (req.query.searchOption == item.name) {
        isSearchOption = true;
      }
    });

    if (!(req.query.searchOption == 'all' || isSearchOption)) {
      next(createHttpError(400, { message: 'searchOption is invalid.' }));
      return;
    }

    const result = await musicService.getMusicList(req.query.searchOption, req.query.orderBy, req.query.searchText);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/history', async (req, res, next) => {
  try {
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
      return;
    }

    const result = await musicService.getMusicHistory(req.userId, req.query.searchText);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/history/:musicId', async (req, res, next) => {
  try {
    const isDuplicate = await musicService.findDuplicateMusic(req.userId, req.params.musicId);

    if (isDuplicate) {
      next(createHttpError(400, { message: 'Already on my music list' }));
      return;
    }

    await musicService.addMusicHistory(req.userId, req.params.musicId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.delete('/history/:musicId', async (req, res, next) => {
  try {
    const music = await musicService.getMusicHistoryInfo(req.userId, req.params.musicId);

    if (music) {
      next(createHttpError(400, { message: "Can't find music in the music list." }));
      return;
    }

    await musicService.deleteMusicHistory(req.userId, req.params.musicId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/:musicId/count', async (req, res, next) => {
  try {
    await musicService.musicCount(req.params.musicId);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
