const AWS = require('aws-sdk');
const config = require('config');
const logger = require('../common/logger')(__filename);

const S3 = new AWS.S3({
  endpoint: new AWS.Endpoint(config.get('server.sens.url')),
  region: 'kr-standard',
  credentials: {
    accessKeyId: config.get('server.sens.accessKey'),
    secretAccessKey: config.get('server.sens.secretKey'),
  },
});

class DownloadService {
  async uploadFile(filePath, file) {
    logger.debug('call DownloadService.uploadFile()');

    await S3.putObject({
      Bucket: config.get('server.sens.bucketName'),
      Key: filePath,
      ACL: 'public-read',
      Body: file,
    }).promise();
  }

  async deleteFile(filePath) {
    logger.debug('call DownloadService.deleteFile()');

    await S3.deleteObject({
      Bucket: config.get('server.sens.bucketName'),
      Key: filePath,
    }).promise();
  }
}

module.exports = new DownloadService();
