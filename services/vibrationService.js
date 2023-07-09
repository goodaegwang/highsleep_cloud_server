const mysqlManager = require('../common/mysqlManager');

const logger = require('../common/logger')(__filename);

class VibrationService {
  async getVibration(userId) {
    logger.debug('call VibrationService.getVibration()');

    const queryList = [
      {
        namespace: 'vibration',
        sqlId: 'getVibration',
        param: {
          userId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result.length === 0 ? {} : result[0].vibration;
  }

  async addVibration(userId, vibration) {
    logger.debug('call VibrationService.addVibration()');

    const queryList = [
      {
        namespace: 'vibration',
        sqlId: 'addVibration',
        param: {
          userId,
          vibration,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updateVibration(userId, vibration) {
    logger.debug('call VibrationService.updateVibration()');

    const queryList = [
      {
        namespace: 'vibration',
        sqlId: 'updateVibration',
        param: {
          userId,
          vibration,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }
}

module.exports = new VibrationService();
