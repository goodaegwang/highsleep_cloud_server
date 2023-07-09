const jwt = require('jsonwebtoken');
const config = require('config');
const dayjs = require('dayjs');
const createHttpError = require('http-errors');
const mysqlManager = require('./mysqlManager');
const commonUtil = require('./commonUtil');
const usersService = require('../services/usersService');
const TokenDTO = require('../models/tokenDTO');
const logger = require('./logger')(__filename);
const SECRET_KEY = config.get('server.clientId');

class AuthService {
  async verifyAuth(req, res, next) {
    logger.debug('call AuthService.verifyAuth()');

    if (!req.baseUrl.includes('/admin/')) {
      try {
        if (!commonUtil.isNullParam(req.cookies.accessToken)) {
          const tokenInfo = jwt.verify(req.cookies.accessToken, SECRET_KEY);

          const token = await this.getTokenInfoByUserId(tokenInfo.userId);

          if (token === undefined || token.accessToken !== req.cookies.accessToken) {
            next(createHttpError(401, { message: 'token is not matched' }));
          }

          req.userId = tokenInfo.userId;
          req.tokenInfo = tokenInfo;

          next();
        } else {
          next(createHttpError(401, { message: 'accessToken is missing.' }));
        }
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          if (!commonUtil.isNullParam(req.cookies.refreshToken)) {
            try {
              let tokenInfo = jwt.verify(req.cookies.refreshToken, SECRET_KEY);

              const result = await this.getTokenInfoByToken(req.cookies.accessToken, req.cookies.refreshToken);

              if (result) {
                const userInfo = await usersService.getUserInfo(result.userId);

                if (userInfo === undefined || userInfo.isStayLogin !== 'Y') {
                  next(createHttpError(401));
                  return;
                }

                // accessToken 재발급
                const token = await this.getToken(result.userId, userInfo.password);
                // accessToken 저장
                await this.updateAccessToken(result.userId, token.accessToken);

                req.userId = tokenInfo.userId;

                res.header('accessToken', token.accessToken);

                next();
              } else {
                next(createHttpError(401, { message: 'Not found matted token.' }));
                return;
              }
            } catch (err) {
              if (err.name === 'TokenExpiredError') {
                next(createHttpError(401, { message: 'refreshToken is expried.' }));
              } else {
                next(createHttpError(401, { message: err.message }));
              }
            }
          } else {
            next(createHttpError(401, { message: 'refreshToken is missing.' }));
          }
        } else {
          logger.error(err.message);
          next(createHttpError(401));
        }
      }
    } else {
      next();
    }
  }

  async getTokenInfoByUserId(userId) {
    logger.debug('call AuthService.getTokenInfoByUserId()');

    const queryList = [
      {
        namespace: 'token',
        sqlId: 'getTokenInfoByUserId',
        param: {
          userId,
        },
      },
    ];

    const result = await mysqlManager.querySingle(queryList);

    return result.length > 0 ? new TokenDTO(result[0]) : undefined;
  }

  async getTokenInfoByToken(accessToken, refreshToken) {
    logger.debug('call AuthService.getTokenInfoByToken()');

    const queryList = [
      {
        namespace: 'token',
        sqlId: 'getTokenInfoByToken',
        param: {
          accessToken,
          refreshToken,
        },
      },
    ];

    const [result] = await mysqlManager.querySingle(queryList);

    return result;
  }

  async updateAccessToken(userId, accessToken) {
    logger.debug('call AuthService.updateAccessToken()');

    const queryList = [
      {
        namespace: 'token',
        sqlId: 'updateAccessToken',
        param: {
          userId,
          accessToken,
        },
      },
    ];

    await mysqlManager.querySingle(queryList);
  }

  async getToken(userId, password) {
    logger.debug('call AuthService.getToken()');

    const accessToken = jwt.sign(
      {
        // Create Access Token
        userId,
        password,
      },
      SECRET_KEY,
      {
        expiresIn: '365d',
        issuer: userId,
      },
    );

    const refreshToken = jwt.sign({}, SECRET_KEY, {
      expiresIn: '365d',
      issuer: userId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async adminVerifyAuth(req, res, next) {
    logger.debug('call AuthService.adminVerifyAuth()');

    try {
      let accessToken = req.get('Authorization');

      if (accessToken == undefined) {
        next(createHttpError(401));
        return;
      }

      accessToken = accessToken.split('Bearer ')[1];

      const tokenInfo = jwt.verify(accessToken, SECRET_KEY);

      const IsAdminId = tokenInfo.userId == config.get('server.admin.id');
      const IsAdminPw = tokenInfo.password == config.get('server.admin.pw');

      if (!(IsAdminId && IsAdminPw)) {
        next(createHttpError(401, { message: 'Not Admin.' }));
        return;
      }

      next();
    } catch (err) {
      logger.error(err);
      next(createHttpError(401));
    }
  }
}

module.exports = new AuthService();
