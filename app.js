const createError = require('http-errors');
const express = require('express');
const Table = require('cli-table');
const cookieParser = require('cookie-parser');
const logger = require('./common/logger')(__filename);
const mysqlManager = require('./common/mysqlManager');
const authService = require('./common/authService');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// database Connection
(async () => {
  try {
    await Promise.all([mysqlManager.init()]);
  } catch (err) {
    logger.error(err.stack);
  }
})();

// router
app.all('*', (req, res, next) => {
  const requestTable = new Table();

  requestTable.push({ Type: ' ==== REQUEST ==== ' });
  requestTable.push({ method: req.method });
  requestTable.push({ url: req.originalUrl });

  req.requestTime = Date.now();

  if (req.method === 'GET' || req.method === 'DELETE') {
    requestTable.push({ query: JSON.stringify(req.query) });
  } else {
    // (req.method === "POST" || req.method === "PUT" || req.method === "PATCH")
    requestTable.push({ 'content-type': req.headers['content-type'] });
    requestTable.push({ body: JSON.stringify(req.body) });

    if (!req.is('application/json') && !req.is('multipart/form-data')) {
      const err = new Error('Invalid content-type.');

      err.status = 406;
      next(err);
      return;
    }
  }

  logger.info(`\n${requestTable.toString()}`);
  logger.debug(`[Header   ] :: ${JSON.stringify(req.headers)}`);

  // offset, limit string to integer
  if (req.query.limit) {
    req.query.limit = Number(req.query.limit);
  }

  if (req.query.offset) {
    req.query.offset = Number(req.query.offset);
  }

  next();
});

// 토큰이 필요하지 않은 경로
app.use('/login', require('./routes/login'));
app.use('/join', require('./routes/join'));
app.use('/help', require('./routes/help'));
app.use('/albumArt', require('./routes/albumArt'));
app.use('/terms', require('./routes/terms'));
app.use('/admin/login', require('./routes/admin/login'));

app.use('*', authService.verifyAuth.bind(authService));

// 토큰이 필요한 경로
app.use('/alarms', require('./routes/alarms'));
app.use('/banners', require('./routes/banners'));
app.use('/devices', require('./routes/devices'));
app.use('/download', require('./routes/download'));
app.use('/genre', require('./routes/genre'));
app.use('/heights', require('./routes/heights'));
app.use('/logout', require('./routes/logout'));
app.use('/music', require('./routes/music'));
app.use('/mypage', require('./routes/mypage'));
app.use('/notices', require('./routes/notices'));
app.use('/popups', require('./routes/popups'));
app.use('/vibration', require('./routes/vibration'));
app.use('/withdrawal', require('./routes/withdrawal'));

app.use('/admin/*', authService.adminVerifyAuth.bind(authService));

app.use('/admin/alarms', require('./routes/admin/alarms'));
app.use('/admin/banners', require('./routes/admin/banners'));
app.use('/admin/common', require('./routes/admin/common'));
app.use('/admin/dashboard', require('./routes/admin/dashboard'));
app.use('/admin/genre', require('./routes/admin/genre'));
app.use('/admin/notices', require('./routes/admin/notices'));
app.use('/admin/users', require('./routes/admin/users'));
app.use('/admin/music', require('./routes/admin/music'));
app.use('/admin/popups', require('./routes/admin/popups'));
app.use('/admin/terms', require('./routes/admin/terms'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// response & error handler
app.use((err, req, res, next) => {
  const responseTable = new Table();

  let responseBody = null;

  if (err instanceof Error) {
    if (err.status < 500) {
      logger.warn(`${req.originalUrl} [${err}]`);
    } else {
      logger.error(`${req.originalUrl} [${err}]`);
      logger.error(err);
    }

    // set the error object
    res.status(err.status || 500);
    responseBody = {
      code: err.code,
      message: err.message,
    };
  } else {
    responseBody = err;
  }

  const endTime = new Date();

  responseTable.push({ Type: ' ==== RESPONSE ==== ' }, { method: req.method }, { url: req.originalUrl }, { status: res.statusCode }, { time: `${(endTime - req.requestTime) / 1000}s` });
  logger.info(`\n${responseTable.toString()}`);

  logger.log({
    level: 'debug',
    message: `[body  ]:: ${JSON.stringify(responseBody)}`,
    length: 500,
  });

  if (res.statusCode === 401) {
    res.send({
      code: '401',
      message: 'Unauthorized',
    });
  } else if (res.statusCode === 404 || res.statusCode === 405) {
    res.send({
      code: res.statusCode,
      message: err.message,
    });
  } else if (
    // eslint-disable-next-line operator-linebreak
    Object.keys(responseBody).length === 0 &&
    responseBody.constructor === Object
  ) {
    res.sendStatus(res.statusCode);
  } else {
    res.send(responseBody);
  }
});

// exception 에러가 발생해도 shutdown 되지 않게 예외 로직 추가
process.on('uncaughtException', (err) => {
  logger.error('========================[Exception Error Occur]===========================');
  logger.error(err.message);
  logger.error(err.stack);
  logger.error('==========================================================================');
});

module.exports = app;
