const mysqlManager = require('../common/mysqlManager');
const DeviceDTO = require('../models/deviceDTO');

const logger = require('../common/logger')(__filename);

class DevicesService {
  async getDevices(userId) {
    logger.debug('call DevicesService.getDevices()');

    const queryList = [
      {
        namespace: 'devices',
        sqlId: 'getDevices',
        param: {
          userId,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new DeviceDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async addDevice(userId, name, device) {
    logger.debug('call DevicesService.addDevice()');

    const id = mysqlManager.makeUUID();

    const queryList = [
      {
        namespace: 'devices',
        sqlId: 'addDevice',
        param: {
          id,
          userId,
          name,
          device,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);

    return id;
  }

  async deleteDevice(id) {
    logger.debug('call DevicesService.deleteDevice()');

    const queryList = [
      {
        namespace: 'devices',
        sqlId: 'deleteDevice',
        param: {
          id,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    if (result.affectedRows === 0) {
      throw { message: 'Not Found device.' };
    }
  }
}

module.exports = new DevicesService();
