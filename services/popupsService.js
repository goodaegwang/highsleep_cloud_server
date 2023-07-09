const mysqlManager = require('../common/mysqlManager');
const PopupDTO = require('../models/popupDTO');

const logger = require('../common/logger')(__filename);

class PopupsService {
  async getPopupAll() {
    logger.info('call PopupsService.getPopupAll()');

    const queryList = [
      {
        namespace: 'popups',
        sqlId: 'getPopupAll',
        param: {},
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new PopupDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getPopups(offset, limit, status, searchText) {
    logger.info('call PopupsService.getPopups()');

    const queryList = [
      {
        namespace: 'popups',
        sqlId: 'getPopups',
        param: {
          offset,
          limit,
          status,
          searchText,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new PopupDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getPopup(popupId) {
    logger.info('call PopupsService.getPopup()');

    const queryList = [
      {
        namespace: 'popups',
        sqlId: 'getPopup',
        param: {
          popupId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return new PopupDTO(result[0]);
  }

  async addPopup(title, imagePath, content, link, startDate, endDate, seq) {
    logger.info('call PopupsService.addPopup()');

    const id = mysqlManager.makeUUID();

    const queryList = [
      {
        namespace: 'popups',
        sqlId: 'addPopup',
        param: {
          id,
          title,
          imagePath,
          content,
          link,
          startDate,
          endDate,
          seq,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updatePopup(popupId, title, imagePath, content, link, startDate, endDate, seq) {
    logger.info('call PopupsService.updatePopup()');

    const queryList = [
      {
        namespace: 'popups',
        sqlId: 'updatePopup',
        param: {
          popupId,
          title,
          imagePath,
          content,
          link,
          startDate,
          endDate,
          seq,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async deletePopup(popupId) {
    logger.info('call PopupsService.deletePopup()');

    const queryList = [
      {
        namespace: 'popups',
        sqlId: 'deletePopup',
        param: {
          popupId,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }
}

module.exports = new PopupsService();
