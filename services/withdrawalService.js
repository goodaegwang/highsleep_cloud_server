const mysqlManager = require('../common/mysqlManager');

const logger = require('../common/logger')(__filename);

class WithdrawalService {
  async withdrawal(userId) {
    logger.debug('call WithdrawalService.withdrawal()');

    let queryList = [
      {
        namespace: 'alarms',
        sqlId: 'deleteAlarmsByUserId',
        param: {
          userId,
        },
      },
      {
        namespace: 'devices',
        sqlId: 'deleteDevicesByUserId',
        param: {
          userId,
        },
      },
      {
        namespace: 'heights',
        sqlId: 'deleteHeightsByUserId',
        param: {
          userId,
        },
      },
      {
        namespace: 'music',
        sqlId: 'deleteMusicHistoryByUserId',
        param: {
          userId,
        },
      },
      {
        namespace: 'vibration',
        sqlId: 'deleteVibrationByUserId',
        param: {
          userId,
        },
      },
      {
        namespace: 'token',
        sqlId: 'logout',
        param: {
          userId,
        },
      },
      {
        namespace: 'users',
        sqlId: 'deleteUser',
        param: {
          userId,
        },
      },
    ];

    await mysqlManager.queryMultiWithTransaction(queryList);
  }
}

module.exports = new WithdrawalService();
