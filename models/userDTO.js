const moment = require('moment-timezone');

class UserDTO {
  constructor(item) {
    this.userId = item.user_id;
    this.email = item.email;
    this.name = item.name;
    this.type = item.type;
    this.status = item.status;
    this.password = item.password;
    this.passwordUpdatedAt = item.password_updated_at == null ? null : moment(item.password_updated_at).format('YYYY-MM-DD HH:mm:ss');
    this.phone = item.phone;
    this.birthday = item.birthday;
    this.isStayLogin = item.is_stay_login;
    this.joinedAt = item.joined_at == null ? null : moment(item.joined_at).format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = item.updated_at == null ? null : moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = UserDTO;
