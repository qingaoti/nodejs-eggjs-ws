/**
 * 生产环境配置
 */
module.exports = appInfo => {
  const config = (exports = {});
  config.keys = appInfo.name + '_1560998186613_6319';
  config.logger = {
    dir: `/data/log/${appInfo.name}`,
    level: 'ERROR',
  };

  return {...config};
};
