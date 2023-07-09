const request = require('request');
const config = require('config');
const crypto = require('crypto');
const logger = require('./logger')(__filename);

class Utils {
  isNullParam = (param) => param === undefined || param === null || param === '' || Number.isNaN(param);

  // 이메일 정규표현식
  emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  verificationCode = Math.floor(Math.random() * 899999) + 100000;

  async randomCode(cnt) {
    let code = '';

    for (let i = 0; i < cnt; i++) {
      code += Math.floor(Math.random() * 10);
    }

    return code;
  }

  // SMS 전송
  async sendSMS(phone) {
    logger.debug('call CommonUtil.sendSMS()');

    let resultCode = 404;
    const date = Date.now().toString();

    const mes = [];

    const sens = config.get('server.sens');
    const uri = sens.serviceId;
    const secretKey = sens.secretKey;
    const accessKey = sens.accessKey;
    const method = 'POST';
    const space = ' ';
    const newLine = '\n';
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;

    const hmac = crypto.createHmac('sha256', secretKey);
    mes.push(method);
    mes.push(space);
    mes.push(url2);
    mes.push(newLine);
    mes.push(date);
    mes.push(newLine);
    mes.push(accessKey);

    const signature = hmac.update(mes.join('')).digest('base64');

    const authNumber = await this.randomCode(6);

    request({
      method,
      json: true,
      url,
      headers: {
        'Contenc-type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature,
      },
      body: {
        type: 'SMS',
        countryCode: '82',
        from: sens.callNumber, // "발신번호기입",
        content: `[HIGHSLEEP] 본인확인 인증번호는 [${authNumber}] 입니다.`, // 문자내용 기입,
        messages: [
          { to: `${phone}` }],
      },
    }, (err, res, html) => {
      if (err) console.log(err);
      else { resultCode = 200; console.log(html); }
    });

    return { authNumber };
  }
}

module.exports = new Utils();
