const express = require('express');
const createHttpError = require('http-errors');
const commonUtil = require('../../common/commonUtil');
const ErrorCode = require('../../models/errorCode');
const heightsService = require('../../services/heightsService');
const usersService = require('../../services/usersService');
const router = express.Router();
const logger = require('../../common/logger')(__filename);

router.get('/type', async (req, res, next) => {
  try {
    const results = await usersService.getJoinTypes();

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

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
    if (req.query.searchText === undefined) {
      next(createHttpError(400, { message: 'searchText is missing.' }));
      return;
    }
    if (commonUtil.isNullParam(req.query.orderBy)) {
      next(createHttpError(400, { message: 'orderBy is missing.' }));
      return;
    }

    const { offset, limit, type, searchText, orderBy } = req.query;

    if (!(orderBy == 'nameAsc' || orderBy == 'joinedAtAsc' || orderBy == 'deviceIdentifierAsc' || orderBy == 'deviceIdentifierDesc')) {
      next(createHttpError(400, { message: 'Wrong orderBy' }));
      return;
    }

    const results = await usersService.getUsers(offset, limit, type, searchText, orderBy);

    res.status(200);
    next(results);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const result = await usersService.getUser(req.params.userId);

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

router.put('/:userId', async (req, res, next) => {
  try {
    if (commonUtil.isNullParam(req.body.name)) {
      next(createHttpError(400, { message: 'name is missing.' }));
    }
    if (commonUtil.isNullParam(req.body.email)) {
      next(createHttpError(400, { message: 'email is missing.' }));
    }
    if (commonUtil.isNullParam(req.body.phone)) {
      next(createHttpError(400, { message: 'phone is missing.' }));
    }
    if (commonUtil.isNullParam(req.body.birthday)) {
      next(createHttpError(400, { message: 'birthday is missing.' }));
    }
    if (commonUtil.isNullParam(req.body.status)) {
      next(createHttpError(400, { message: 'status is missing.' }));
    }

    const { name, email, phone, birthday, status } = req.body;

    await usersService.getUser(req.params.userId, name, email, phone, birthday, status);

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

router.get('/:userId/heightRecods', async (req, res, next) => {
  try {
    const result = await heightsService.getHeights(req.params.userId);

    res.status(200);
    next(result);
  } catch (err) {
    logger.error(err);
    next(err);
  }
});

module.exports = router;
