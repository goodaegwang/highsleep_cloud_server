const fs = require('fs');
const mysqlManager = require('../common/mysqlManager');
const GenreDTO = require('../models/genreDTO');
const downloadService = require('./downloadService');
const logger = require('../common/logger')(__filename);

class GenreService {
  async getGenreList() {
    logger.debug('call GenreService.getGenreList()');

    const queryList = [
      {
        namespace: 'genre',
        sqlId: 'getGenreList',
        param: {},
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new GenreDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: resultsSet.length,
    };
  }

  async getGenre(no) {
    logger.debug('call GenreService.getGenre()');

    const queryList = [
      {
        namespace: 'genre',
        sqlId: 'getGenre',
        param: {
          no,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    if (result.length === 0) {
      throw { message: 'Not Found genre.' };
    }

    const resultSet = new GenreDTO(result[0]);

    return resultSet;
  }

  async genreCount(no) {
    logger.debug('call GenreService.genreCount()');

    const queryList = [
      {
        namespace: 'genre',
        sqlId: 'genreCount',
        param: {
          no,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  // 관리자
  async getGenres(offset, limit, status, searchText, orderBy) {
    logger.debug('call GenreService.getGenres()');

    const queryList = [
      {
        namespace: 'genre',
        sqlId: 'getGenres',
        param: {
          offset,
          limit,
          status,
          searchText,
          orderBy,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new GenreDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: resultsSet.length,
    };
  }

  async addGenre(name, status, imagePath) {
    logger.debug('call GenreService.addGenre()');

    const result = await this.getGenres(0, 1, 'all', '', 'seqDesc');

    const queryList = [
      {
        namespace: 'genre',
        sqlId: 'addGenre',
        param: {
          name,
          seq: result.count === 0 ? 1 : result.items[0].seq + 1,
          status,
          imagePath,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updateGenre(genreNo, name, seq, status, imagePath) {
    logger.debug('call GenreService.updateGenre()');

    const genreInfo = await this.getGenre(genreNo);

    if (genreInfo.seq != seq) {
      await this.updateGenreSeq(genreInfo.seq, null);
      if (genreInfo.seq < seq) {
        for (let i = genreInfo.seq; i < seq; i++) {
          // eslint-disable-next-line no-await-in-loop
          await this.updateGenreSeq(i + 1, i);
        }
      } else if (genreInfo.seq > seq) {
        for (let i = genreInfo.seq; i > seq; i--) {
          // eslint-disable-next-line no-await-in-loop
          await this.updateGenreSeq(i - 1, i);
        }
      }
    }

    const queryList = [
      {
        namespace: 'genre',
        sqlId: 'updateGenre',
        param: {
          genreNo,
          name,
          seq,
          status,
          imagePath,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updateGenreSeq(oldSeq, newSeq) {
    logger.debug('call GenreService.updateGenreSeq()');

    const queryList = [
      {
        namespace: 'genre',
        sqlId: 'updateGenreSeq',
        param: {
          oldSeq: Number(oldSeq),
          newSeq: Number(newSeq),
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async deleteGenre(no) {
    logger.debug('call GenreService.deleteGenre()');

    const genreInfo = await this.getGenre(no);
    const genreList = await this.getGenreList();

    await downloadService.deleteFile(genreInfo.imagePath);

    const queryList = [
      {
        namespace: 'genre',
        sqlId: 'deleteGenre',
        param: {
          no,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);

    for (let i = genreInfo.seq; i < genreList.count; i++) {
      // eslint-disable-next-line no-await-in-loop
      await this.updateGenreSeq(i + 1, i);
    }
  }
}

module.exports = new GenreService();
