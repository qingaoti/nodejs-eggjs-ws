/* eslint valid-jsdoc: 'off' */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1570844978427_2943';

  // add your middleware config here
  config.logger = {
    dir: `./${appInfo.name}_test_log`,
    level: 'DEBUG',
  };

  return {
    ...config,
  };
};
