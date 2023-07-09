const express = require('express');
const genreService = require('../services/genreService');
const router = express.Router();
const logger = require('../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    const results = await genreService.getGenreList();

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/:genreNo/count', async (req, res, next) => {
  try {
    await genreService.genreCount(req.params.genreNo);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
