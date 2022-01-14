/**
 * 本地配置
 */
module.exports = appInfo => {
  const config = (exports = {});

  config.debug = true;
  config.logger = {
    dir: `./${appInfo.name}`,
    level: 'DEBUG',
  };

  config.apiServer = {

  };

  return {...config};
};
