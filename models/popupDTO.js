const moment = require('moment-timezone');

class PopupDTO {
  constructor(item) {
    this.id = item.id;
    this.title = item.title;
    this.imagePath = item.image_path;
    this.content = item.content;
    this.link = item.link;
    this.startDate = item.start_date == null ? null : moment(item.start_date).format('YYYY-MM-DD HH:mm:ss');
    this.endDate = item.end_date == null ? null : moment(item.end_date).format('YYYY-MM-DD HH:mm:ss');
    this.seq = item.seq;
    this.createdAt = item.created_at == null ? null : moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = item.updated_at == null ? null : moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = PopupDTO;
