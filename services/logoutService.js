const logger = require('../common/logger')(__filename);
const mysqlManager = require('../common/mysqlManager');

class LogoutService {
  async logout(userId) {
    logger.debug('call LogoutService.logout()');

    const queryList = [
      {
        namespace: 'token',
        sqlId: 'logout',
        param: {
          userId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    if (result.affectedRows === 0) {
      throw { message: 'user token is missing.' };
    }
  }
}

module.exports = new LogoutService();
