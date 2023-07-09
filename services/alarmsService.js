const mysqlManager = require('../common/mysqlManager');
const AlarmDTO = require('../models/alarmDTO');
const logger = require('../common/logger')(__filename);

class AlarmsService {
  // 사용자
  async getAlarmsOfUser(userId) {
    logger.debug('call AlarmsService.getAlarmsOfUser()');

    const queryList = [
      {
        namespace: 'alarms',
        sqlId: 'getAlarmsOfUser',
        param: {
          userId,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new AlarmDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async deleteUserAlarm(userId, alarmId) {
    logger.debug('call AlarmsService.deleteUserAlarm()');

    const queryList = [
      {
        namespace: 'alarms',
        sqlId: 'deleteUserAlarm',
        param: {
          userId,
          alarmId,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  // 관리자
  async getAlarms(offset, limit, searchText) {
    logger.debug('call AlarmsService.getAlarms()');

    const queryList = [
      {
        namespace: 'alarms',
        sqlId: 'getAlarms',
        param: {
          offset,
          limit,
          searchText,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new AlarmDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getAlarm(alarmId) {
    logger.debug('call AlarmsService.getAlarm()');

    const queryList = [
      {
        namespace: 'alarms',
        sqlId: 'getAlarm',
        param: {
          alarmId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return new AlarmDTO(result[0]);
  }

  async addAlarm(title, content) {
    logger.debug('call AlarmsService.addAlarm()');

    const userIds = await this.getUserIds();

    const id = mysqlManager.makeUUID();

    const queryList = [
      {
        namespace: 'alarms',
        sqlId: 'addAlarm',
        param: {
          id,
          title,
          content,
        },
      },
    ];

    // eslint-disable-next-line array-callback-return
    userIds.map((item) => {
      queryList.push({
        namespace: 'alarms',
        sqlId: 'addAlarmUsers',
        param: {
          id,
          userId: item.userId,
        },
      });
    });

    await mysqlManager.queryMultiWithTransaction(queryList);
  }

  async getUserIds() {
    logger.debug('call AlarmsService.getUserIds()');

    const queryList = [
      {
        namespace: 'users',
        sqlId: 'getUserIds',
        param: {},
      },
    ];

    const results = await mysqlManager.querySingle(queryList);

    return results;
  }

  async updateAlarm(alarmId, title, content, status) {
    logger.debug('call AlarmsService.updateAlarm()');

    const queryList = [
      {
        namespace: 'alarms',
        sqlId: 'updateAlarm',
        param: {
          alarmId,
          title,
          content,
          status,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async deleteAlarm(alarmId) {
    logger.debug('call AlarmsService.deleteAlarm()');

    const queryList = [
      {
        namespace: 'alarms',
        sqlId: 'deleteAlarmsByAlarmId',
        param: {
          alarmId,
        },
      },
      {
        namespace: 'alarms',
        sqlId: 'deleteAlarm',
        param: {
          alarmId,
        },
      },
    ];

    await mysqlManager.queryMultiWithTransaction(queryList);
  }
}

module.exports = new AlarmsService();
