const logger = require('../common/logger')(__filename);
const mysqlManager = require('../common/mysqlManager');
const HeightDTO = require('../models/heightDTO');

class HeightsService {
  async getHeightPerDay(userId) {
    logger.debug('call HeightsService.getHeightPerDay()');

    const queryList = [
      {
        namespace: 'heights',
        sqlId: 'getHeightPerDay',
        param: {
          userId,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new HeightDTO(item, 'day'));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getHeightByMonth(userId) {
    logger.debug('call HeightsService.getHeightByMonth()');

    const queryList = [
      {
        namespace: 'heights',
        sqlId: 'getHeightByMonth',
        param: {
          userId,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new HeightDTO(item, 'month'));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getHeight(userId, date) {
    logger.debug('call HeightsService.getHeight()');

    const queryList = [
      {
        namespace: 'heights',
        sqlId: 'getHeight',
        param: {
          userId,
          date,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);

    return results.length == 0 ? null : new HeightDTO(results[0], 'day');
  }

  async addHeight(userId, height, date) {
    logger.debug('call HeightsService.addHeight()');

    const id = mysqlManager.makeUUID();

    const queryList = [
      {
        namespace: 'heights',
        sqlId: 'addHeight',
        param: {
          id,
          userId,
          height,
          date,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);

    return id;
  }

  async updateHeight(heightId, height, date) {
    logger.debug('call HeightsService.updateHeight()');

    const queryList = [
      {
        namespace: 'heights',
        sqlId: 'updateHeight',
        param: {
          heightId,
          height,
          date,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    if (result.affectedRows === 0) {
      throw { message: 'heightId is missing.' };
    }
  }

  async deleteHeight(heightId) {
    logger.debug('call HeightsService.deleteHeight()');

    const queryList = [
      {
        namespace: 'heights',
        sqlId: 'deleteHeight',
        param: {
          heightId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    if (result.affectedRows === 0) {
      throw { message: 'heightId is missing.' };
    }
  }
}

module.exports = new HeightsService();
