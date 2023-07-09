const createHttpError = require('http-errors');

const logger = require('../common/logger')(__filename);

class ErrorCode {
  constructor(message, next) {
    logger.debug('call ErrorCode.IsURLError()');

    if (message == "Cannot read properties of undefined (reading 'id')") {
      next(createHttpError(404, { message: 'Wrong params id' }));
      this.isNotFound = true;
    } else {
      this.isNotFound = false;
    }
  }
}

module.exports = ErrorCode;
