const mysqlManager = require('../common/mysqlManager');
const TermDTO = require('../models/termDTO');

const logger = require('../common/logger')(__filename);

class TermsService {
  async getTerms(offset, limit, searchText) {
    logger.debug('call TermsService.getTerms()');

    const queryList = [
      {
        namespace: 'terms',
        sqlId: 'getTerms',
        param: {
          offset,
          limit,
          searchText,
        },
      },
    ];

    const results = await mysqlManager.querySingle(queryList);
    const resultsSet = results.map((item) => new TermDTO(item));

    return {
      items: results.length === 0 ? [] : resultsSet,
      count: results.length,
    };
  }

  async getTerm(termId) {
    logger.debug('call TermsService.getTerm()');

    const queryList = [
      {
        namespace: 'terms',
        sqlId: 'getTerm',
        param: {
          termId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return new TermDTO(result[0]);
  }

  async addTerm(title, content, isRequired) {
    logger.debug('call TermsService.addTerm()');

    const id = mysqlManager.makeUUID();

    const queryList = [
      {
        namespace: 'terms',
        sqlId: 'addTerm',
        param: {
          id,
          title,
          content,
          isRequired,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async updateTerm(termId, title, content, isRequired) {
    logger.debug('call TermsService.updateTerm()');

    const queryList = [
      {
        namespace: 'terms',
        sqlId: 'updateTerm',
        param: {
          termId,
          title,
          content,
          isRequired,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async deleteTerm(termId) {
    logger.debug('call TermsService.deleteTerm()');

    const queryList = [
      {
        namespace: 'terms',
        sqlId: 'deleteTerm',
        param: {
          termId,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }
}

module.exports = new TermsService();
