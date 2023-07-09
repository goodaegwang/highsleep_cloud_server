const mysqlManager = require('../common/mysqlManager');
const BannerDTO = require('../models/bannerDTO');

const logger = require('../common/logger')(__filename);

class BannersService {
  // 사용자
  async getBannersAll() {
    logger.info('call BannersService.getBannersAll()');

    const queryList = [
      {
        namespace: 'banners',
        sqlId: 'getBannersAll',
        param: {},
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new BannerDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  // 관리자
  async getBanners(offset, limit, status, searchText) {
    logger.info('call BannersService.getBanners()');

    const queryList = [
      {
        namespace: 'banners',
        sqlId: 'getBanners',
        param: {
          offset,
          limit,
          status,
          searchText,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new BannerDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getBanner(bannerId) {
    logger.info('call BannersService.getBanner()');

    const queryList = [
      {
        namespace: 'banners',
        sqlId: 'getBanner',
        param: {
          bannerId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return new BannerDTO(result[0]);
  }

  async addBanner(title, imagePath, content, link, startDate, endDate, seq) {
    logger.info('call BannersService.addBanner()');

    const id = mysqlManager.makeUUID();

    const queryList = [
      {
        namespace: 'banners',
        sqlId: 'addBanner',
        param: {
          id,
          title,
          imagePath,
          content,
          link,
          startDate,
          endDate,
          seq,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updateBanner(bannerId, title, imagePath, content, link, startDate, endDate, seq) {
    logger.info('call BannersService.updateBanner()');

    const queryList = [
      {
        namespace: 'banners',
        sqlId: 'updateBanner',
        param: {
          bannerId,
          title,
          imagePath,
          content,
          link,
          startDate,
          endDate,
          seq,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async deleteBanner(bannerId) {
    logger.info('call BannersService.deleteBanner()');

    const queryList = [
      {
        namespace: 'banners',
        sqlId: 'deleteBanner',
        param: {
          bannerId,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }
}

module.exports = new BannersService();
