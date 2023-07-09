const mysqlManager = require('../common/mysqlManager');
const NoticeDTO = require('../models/noticeDTO');

const logger = require('../common/logger')(__filename);

class NoticesService {
  async getNoticeList() {
    logger.debug('call NoticesService.getNoticeList()');

    const queryList = [
      {
        namespace: 'notices',
        sqlId: 'getNoticeList',
        param: {},
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new NoticeDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getNotices(offset, limit, searchText) {
    logger.debug('call NoticesService.getNotices()');

    const queryList = [
      {
        namespace: 'notices',
        sqlId: 'getNotices',
        param: {
          offset,
          limit,
          searchText,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new NoticeDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getNotice(noticeId) {
    logger.debug('call NoticesService.getNotice()');

    const queryList = [
      {
        namespace: 'notices',
        sqlId: 'getNotice',
        param: {
          noticeId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return new NoticeDTO(result[0]);
  }

  async addNotice(title, content, imagePath) {
    logger.debug('call NoticesService.addNotice()');

    const id = mysqlManager.makeUUID();

    const queryList = [
      {
        namespace: 'notices',
        sqlId: 'addNotice',
        param: {
          id,
          title,
          content,
          imagePath,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updateNotice(noticeId, title, content, status, imagePath) {
    logger.debug('call NoticesService.updateNotice()');

    const queryList = [
      {
        namespace: 'notices',
        sqlId: 'updateNotice',
        param: {
          noticeId,
          title,
          content,
          status,
          imagePath,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async deleteNotice(noticeId) {
    logger.debug('call NoticesService.deleteNotice()');

    const queryList = [
      {
        namespace: 'notices',
        sqlId: 'deleteNotice',
        param: {
          noticeId,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }
}

module.exports = new NoticesService();
