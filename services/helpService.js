const mysqlManager = require('../common/mysqlManager');

const logger = require('../common/logger')(__filename);

class HelpService {
  async findUserByNameAndPhone(name, phone) {
    logger.debug('call HelpService.findUserByNameAndPhone()');

    const queryList = [
      {
        namespace: 'help',
        sqlId: 'findUserByNameAndPhone',
        param: {
          name,
          phone,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result;
  }

  async findUserByUserIdAndNameAndPhone(userId, name, phone) {
    logger.debug('call HelpService.findUserByUserIdAndNameAndPhone()');

    const queryList = [
      {
        namespace: 'help',
        sqlId: 'findUserByUserIdAndNameAndPhone',
        param: {
          userId,
          name,
          phone,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result;
  }

  async updatePassword(userId, password) {
    logger.debug('call HelpService.updatePassword()');

    const queryList = [
      {
        namespace: 'help',
        sqlId: 'updatePassword',
        param: {
          userId,
          password,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    if (result.affectedRows === 0) {
      throw { message: 'Not found userId.' };
    }
  }
}

module.exports = new HelpService();
