const moment = require('moment-timezone');

class CommonDTO {
  constructor(item) {
    this.no = item.no;
    this.name = item.name;
    this.imagePath = item.image_path;
    this.createdAt = moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = CommonDTO;
