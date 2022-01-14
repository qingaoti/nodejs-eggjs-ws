'use strict';
/**
 * 默认配置
 */
module.exports = appInfo => {
  const config = {};
  config.keys = appInfo.name + '_1560998186613_619';
  config.debug = true;

  config.middleware = [
    'errorMiddleware'
  ];

  config.logger = {
    dir: `./${appInfo.name}`,
    level: 'ERROR',
  };

  /**
   * 日志切片
   */
  config.logrotator = {
    filesRotateByHour: [],
    hourDelimiter: '-',
    filesRotateBySize: [],
    // Max file size to judge if any file need rotate
    maxFileSize: 50 * 1024 * 1024,
    // pieces rotate by size
    maxFiles: 10,
    // time interval to judge if any file need rotate
    rotateDuration: 60000,
    // keep max days log files, default is `31`. Set `0` to keep all logs
    maxDays: 365,
  };

  // 安全设置
  (config.security = {
    csrf: {
      enable: false,
    },
  });

  config.cookieMaxAge = 1000 * 3600 * 24;

  config.i18n = {
    // 默认语言，默认 "en_US"
    defaultLocale: 'zh-CN',
    // URL 参数，默认 "locale"
    queryField: 'locale',
    // Cookie 记录的 key, 默认："locale"
    cookieField: 'locale',
    // Cookie 的 domain 配置，默认为空，代表当前域名有效
    cookieDomain: '',
    // Cookie 默认 `1y` 一年后过期， 如果设置为 Number，则单位为 ms
    cookieMaxAge: '1y',
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  //egg io
  config.io = {
    // init: {
    //   wsEngine: 'ws',
    // }, // passed to engine.io
    namespace: {
      '/': {
  // # 预处理器中间件, 我们这里配置了一个auth, 进行权限判断, 它对应的文件是/app/io/middleware/auth.js, 这里可以配置多个文件, 用逗号隔开
  // connectionMiddleware: ['auth'], #这里我们可以做一些权限校验之类的操作
  // packetMiddleware: [], # 通常用于对消息做预处理，又或者是对加密消息的解密等操作
        connectionMiddleware: ['auth']
        // packetMiddleware: ['clientMiddleware'],
      }
    },

    room:{
      substation: 'substation'
    }
  };

  // 跨域设置
  (config.cors = {
    origin: '*', // 访问白名单
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  });

  //---------------------------------业务配置-------------------------------------//
  config.HealthyTime = 5;


  return config;
};
