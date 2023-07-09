const moment = require('moment-timezone');

class DashboardDTO {
  constructor(item, period) {
    if (period == 'day') {
      this.date = moment(item.date).format('YYYY-MM-DD');
    } else if (period == 'month') {
      this.date = `${moment().format('YYYY')}-${item.date}`;
    } else if (period == 'year') {
      this.date = item.date;
    } else {
      this.date = null;
    }

    this.startDate = item.start_date == null ? null : moment(item.start_date).format('YYYY-MM-DD');
    this.endDate = item.end_date == null ? null : moment(item.end_date).format('YYYY-MM-DD');
    this.userCount = item.user_count;
  }
}

module.exports = DashboardDTO;
