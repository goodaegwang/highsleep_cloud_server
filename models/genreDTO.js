const moment = require('moment-timezone');

class GenreDTO {
  constructor(item) {
    this.no = item.no;
    this.name = item.name;
    this.seq = item.seq;
    this.status = item.status;
    this.imagePath = item.image_path;
    this.soundTrackCount = item.sound_track_count;
    this.lastSoundTrackAddedDate = item.last_sound_track_added_date == null ? null : moment(item.last_sound_track_added_date).format('YYYY-MM-DD HH:mm:ss');
    this.viewCount = item.view_count;
    this.createdAt = item.created_at == null ? null : moment(item.created_at).format('YYYY-MM-DD HH:mm:ss');
    this.updatedAt = item.updated_at == null ? null : moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss');
  }
}

module.exports = GenreDTO;
