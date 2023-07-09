const mysqlManager = require('../common/mysqlManager');
const { MusicDTO, MusicHistoryDTO } = require('../models/musicDTO');
const logger = require('../common/logger')(__filename);

class MusicService {
  async getMusicList(searchOption, orderBy, searchText) {
    logger.debug('call MusicService.getMusicList()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'getMusicList',
        param: {
          searchOption,
          orderBy,
          searchText,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new MusicDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getMusicHistory(userId, searchText) {
    logger.debug('call MusicService.getMusicHistory()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'getMusicHistory',
        param: {
          userId,
          searchText,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new MusicHistoryDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async addMusicHistory(userId, musicId) {
    logger.debug('call MusicService.addMusicHistory()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'addMusicHistory',
        param: {
          userId,
          musicId,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async findDuplicateMusic(userId, musicId) {
    logger.debug('call MusicService.findDuplicateMusic()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'findDuplicateMusic',
        param: {
          userId,
          musicId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result.length > 0;
  }

  async getMusicInfo(musicId) {
    logger.debug('call MusicService.getMusicInfo()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'getMusicInfo',
        param: {
          musicId,
        },
      },
    ];

    const [result] = await mysqlManager.querySingle(queryList);
    const resultSet = await new MusicDTO(result);

    return resultSet;
  }

  async getMusicHistoryInfo(userId, musicId) {
    logger.debug('call MusicService.getMusicHistoryInfo()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'getMusicHistoryInfo',
        param: {
          userId,
          musicId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result.length === 0;
  }

  async deleteMusicHistory(userId, musicId) {
    logger.debug('call MusicService.deleteMusicHistory()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'deleteMusicHistory',
        param: {
          userId,
          musicId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    if (result.affectedRows === 0) {
      throw { message: 'musicId is missing.' };
    }
  }

  async musicCount(musicId) {
    logger.debug('call MusicService.musicCount()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'musicCount',
        param: {
          musicId,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  // 관리자
  async getMusics(offset, limit, type, searchText, orderBy, status) {
    logger.debug('call MusicService.getMusics()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'getMusics',
        param: {
          offset,
          limit,
          type,
          searchText,
          orderBy,
          status,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new MusicDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async addMusic(imagePath, title, artist, musicPath, genre, status) {
    logger.debug('call MusicService.addMusic()');

    const id = mysqlManager.makeUUID();

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'addMusic',
        param: {
          id,
          title,
          artist,
          musicPath,
          imagePath,
          genre: genre.charAt(0).toUpperCase() + genre.slice(1),
          status,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updateMusic(musicId, imagePath, title, artist, musicPath, status) {
    logger.debug('call MusicService.updateMusic()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'updateMusic',
        param: {
          musicId,
          title,
          artist,
          musicPath,
          imagePath,
          status,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async deleteMusic(musicId) {
    logger.debug('call MusicService.deleteMusic()');

    const queryList = [
      {
        namespace: 'music',
        sqlId: 'deleteMusic',
        param: {
          musicId,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }
}

module.exports = new MusicService();
