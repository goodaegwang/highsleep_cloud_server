// eslint-disable-next-line max-classes-per-file
const moment = require('moment-timezone');

class MusicDTO {
  constructor(item) {
    this.id = item.id;
    this.title = item.title;
    this.artist = item.artist;
    this.musicPath = item.music_path;
    this.imagePath = item.image_path;
    this.genre = item.genre;
    this.status = item.status;
    this.createdAt = item.created_at == null ? null : moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = item.updated_at == null ? null : moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

class MusicHistoryDTO {
  constructor(item) {
    this.userId = item.user_id;
    this.musicId = item.music_id;
    this.title = item.title;
    this.artist = item.artist;
    this.musicPath = item.music_path;
    this.image_path = item.image_path;
    this.genre = item.genre;
    this.status = item.status;
    this.createdAt = item.created_at == null ? null : moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports.MusicDTO = MusicDTO;
module.exports.MusicHistoryDTO = MusicHistoryDTO;
