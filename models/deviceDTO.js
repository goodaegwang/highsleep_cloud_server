const moment = require('moment-timezone');

class DeviceDTO {
  constructor(item) {
    this.id = item.id;
    this.name = item.name;
    this.userId = item.user_id;
    this.device = item.device;
    this.createdAt = item.created_at == null ? null : moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = item.updated_at == null ? null : moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = DeviceDTO;
