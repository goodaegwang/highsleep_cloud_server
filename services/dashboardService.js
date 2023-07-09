const mysqlManager = require('../common/mysqlManager');
const DashboardDTO = require('../models/dashboardDTO');
const logger = require('../common/logger')(__filename);

class DashboardService {
  async getUserAndDeviceCount() {
    logger.debug('call DashboardService.getUserAndDeviceCount()');

    const queryList = [
      {
        namespace: 'dashboard',
        sqlId: 'getUserAndDeviceCount',
        param: {},
      },
    ];

    const [result] = await mysqlManager.querySingle(queryList);

    return result;
  }

  async getSubscriptionStatistics(period) {
    logger.debug('call DashboardService.getSubscriptionStatistics()');

    const queryList = [];

    if (period == 'day') {
      queryList.push({
        namespace: 'dashboard',
        sqlId: 'getDailyStatistics',
        param: {},
      });
    } else if (period == 'week') {
      queryList.push({
        namespace: 'dashboard',
        sqlId: 'getWeeklyStatistics',
        param: {},
      });
    } else if (period == 'month') {
      queryList.push({
        namespace: 'dashboard',
        sqlId: 'getMonthlyStatistics',
        param: {},
      });
    } else if (period == 'year') {
      queryList.push({
        namespace: 'dashboard',
        sqlId: 'getAnnualStatistics',
        param: {},
      });
    }

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new DashboardDTO(item, period));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getSubscriptionStatus() {
    logger.debug('call DashboardService.getSubscriptionStatus()');

    const queryList = [
      {
        namespace: 'dashboard',
        sqlId: 'getSubscriptionStatus',
        param: {},
      },
    ];

    const results = await mysqlManager.querySingle(queryList);

    return {
      items: results.length === 0 ? [] : results,
      count: results.length,
    };
  }
}

module.exports = new DashboardService();
