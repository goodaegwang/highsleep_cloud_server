const logger = require('../common/logger')(__filename);
const mysqlManager = require('../common/mysqlManager');

class JoinService {
  async join(name, userId, type, phone, birthday, password) {
    logger.debug('call JoinService.join()');

    const queryList = [
      {
        namespace: 'join',
        sqlId: 'join',
        param: {
          name,
          userId,
          type,
          phone,
          birthday,
          password,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async isIdDuplicate(userId) {
    logger.debug('call JoinService.isIdDuplicate()');

    const queryList = [
      {
        namespace: 'join',
        sqlId: 'isIdDuplicate',
        param: {
          userId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result.length > 0;
  }
}

module.exports = new JoinService();
