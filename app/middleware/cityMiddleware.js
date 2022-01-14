'use strict';
const _ = require('lodash');
const {rst} = require('ntms-nodejs-base');

/**
 * city校验中间件
 */
module.exports = (options, app) => {
  return async function cityValid(ctx, next) {
    const City = ctx.header.city;
    if (_.isEmpty(City)) throw rst.error(403, '城市不能为空');
    if (!_.includes(app.config.sequelize.databaseList, City)) throw rst.error(403, '没有该城市的数据库');
    ctx.City = City;
    await next();
  };
};
