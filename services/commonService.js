const mysqlManager = require('../common/mysqlManager');
const CommonDTO = require('../models/commonDTO');

const logger = require('../common/logger')(__filename);

class CommonService {
  async getCommonImages() {
    logger.debug('call CommonService.getCommonImages()');

    const queryList = [
      {
        namespace: 'common',
        sqlId: 'getCommonImages',
        param: {},
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new CommonDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getCommonImage(no) {
    logger.debug('call CommonService.getCommonImage()');

    const queryList = [
      {
        namespace: 'common',
        sqlId: 'getCommonImage',
        param: {
          no,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);

    return new CommonDTO(results[0]);
  }

  async addCommonImage(name, imagePath) {
    logger.debug('call CommonService.addCommonImage()');

    const queryList = [
      {
        namespace: 'common',
        sqlId: 'addCommonImage',
        param: {
          name,
          imagePath,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updateCommonImage(no, imagePath) {
    logger.debug('call CommonService.updateCommonImage()');

    const queryList = [
      {
        namespace: 'common',
        sqlId: 'updateCommonImage',
        param: {
          no,
          imagePath,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async deleteCommonImage(no) {
    logger.debug('call CommonService.deleteCommonImage()');

    const queryList = [
      {
        namespace: 'common',
        sqlId: 'deleteCommonImage',
        param: {
          no,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }
}

module.exports = new CommonService();
