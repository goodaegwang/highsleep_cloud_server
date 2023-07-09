const mysqlManager = require('../common/mysqlManager');
const UserDTO = require('../models/userDTO');

const logger = require('../common/logger')(__filename);

class UsersService {
  async getUserInfo(userId) {
    logger.debug('call UsersService.getUserInfo()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'getUserInfoByUserId',
        param: {
          userId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result.length === 0 ? undefined : new UserDTO(result[0]);
  }

  async updateUserInfo(userId, phone, birthday, password) {
    logger.debug('call UsersService.updateUserInfo()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'updateUserInfo',
        param: {
          userId,
          phone,
          birthday,
          password,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  // 관리자
  async getJoinTypes() {
    logger.debug('call UsersService.getJoinTypes()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'getJoinTypes',
        param: {},
      },
    ];

    const results = await mysqlManager.querySingle(queryList);

    return {
      items: results.length === 0 ? [] : results,
      count: results.length,
    };
  }

  async getUsers(offset, limit, type, searchText, orderBy) {
    logger.debug('call UsersService.getUsers()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'getUsers',
        param: {
          offset,
          limit,
          type,
          searchText,
          orderBy,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new UserDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getUser(userId) {
    logger.debug('call UsersService.getUser()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'getUser',
        param: {
          userId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return new UserDTO(result[0]);
  }

  async updateUser(userId, name, email, phone, birthday, status) {
    logger.debug('call UsersService.updateUser()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'updateUser',
        param: {
          userId,
          name,
          email,
          phone,
          birthday,
          status,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return new UserDTO(result[0]);
  }
}

module.exports = new UsersService();
