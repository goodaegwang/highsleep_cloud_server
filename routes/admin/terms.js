const express = require('express');
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const ErrorCode = require('../../models/errorCode');
const termsService = require('../../services/termsService');
const router = express.Router();
const logger = require('../../common/logger')(__filename);

router.get('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.query.offset)) {
      next(createHttpError(400, { message: 'offset is missing.' }));
    }
    if (commonUtil.isNullParam(req.query.limit)) {
      next(createHttpError(400, { message: 'limit is missing.' }));
    }
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
    }

    const results = await termsService.getTerms(req.query.offset, req.query.limit, req.query.searchText);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/:termId', async (req, res, next) => {
  try {
    const result = await termsService.getTerm(req.params.termId);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
    }
    if (commonUtil.isNullParam(req.body.content)) {
      next(createHttpError(400, { message: 'content is missing.' }));
    }
    if (commonUtil.isNullParam(req.body.isRequired)) {
      next(createHttpError(400, { message: 'isRequired is missing.' }));
    }

    await termsService.addTerm(req.body.title, req.body.content, req.body.isRequired);

    res.status(204);
    next({});
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.put('/:termId', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.title)) {
      next(createHttpError(400, { message: 'title is missing.' }));
    }
    if (commonUtil.isNullParam(req.body.content)) {
      next(createHttpError(400, { message: 'content is missing.' }));
    }
    if (commonUtil.isNullParam(req.body.isRequired)) {
      next(createHttpError(400, { message: 'isRequired is missing.' }));
    }

    await termsService.updateTerm(req.params.termId, req.body.title, req.body.content, req.body.isRequired);

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

router.delete('/:termId', async (req, res, next) => {
  try {
    await termsService.deleteTerm(req.params.termId);

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
