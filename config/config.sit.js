/* eslint valid-jsdoc: 'off' */

module.exports = appInfo => {
  const config = (exports = {});

  config.logger = {
    dir: `./${appInfo.name}`,
    level: 'INFO',
  };

  return {
    ...config,
  };
};
