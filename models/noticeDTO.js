const moment = require('moment-timezone');

class NoticeDTO {
  constructor(item) {
    this.id = item.id;
    this.title = item.title;
    this.content = item.content;
    this.status = item.status;
    this.imagePath = item.image_path;
    this.createdAt = item.created_at == null ? null : moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = item.updated_at == null ? null : moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = NoticeDTO;
