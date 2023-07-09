const config = require('config');
const logger = require('../common/logger')(__filename);
const mysqlManager = require('../common/mysqlManager');
const UserDTO = require('../models/userDTO');

class LoginService {
  async addAccessToken(userId, accessToken, refreshToken) {
    logger.debug('call LoginService.addAccessToken()');

    const queryList = [
      {
        namespace: 'token',
        sqlId: 'addAccessToken',
        param: {
          userId,
          accessToken,
          refreshToken,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async addAdminAccessToken(userId, accessToken) {
    logger.debug('call LoginService.addAdminAccessToken()');

    const queryList = [
      {
        namespace: 'token',
        sqlId: 'addAdminAccessToken',
        param: {
          userId,
          accessToken,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async getUserInfo(userId, password) {
    logger.debug('call LoginService.getUserInfo()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'getUserInfo',
        param: {
          userId,
          password,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result.length === 0 ? undefined : new UserDTO(result[0]);
  }

  async updateIsStayLoginYN(userId, isStayLogin) {
    logger.debug('call LoginService.updateIsStayLoginYN()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'updateIsStayLoginYN',
        param: {
          userId,
          isStayLogin,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }
}

module.exports = new LoginService();
