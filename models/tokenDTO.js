const moment = require('moment-timezone');

class TokenDTO {
  constructor(item) {
    this.userId = item.user_id;
    this.accessToken = item.access_token;
    this.refreshToken = item.refresh_token;
    this.createdAt = item.created_at == null ? null : moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = TokenDTO;
