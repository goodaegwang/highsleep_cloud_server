const moment = require('moment-timezone');
let date = '';
let splitDate = [];

class HeightDTO {
  constructor(item, type) {
    this.height = item.height;

    if (type == 'day') {
      this.id = item.id;
      this.userId = item.user_id;
      this.date = item.date == null ? null : moment(item.date).format('YYYY-MM-DD');
    } else {
      this.date = item.date_avg == null ? null : item.date_avg;
    }
  }
}

module.exports = HeightDTO;
