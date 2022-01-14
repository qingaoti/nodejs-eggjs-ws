'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {router, controller} = app;

  /**
   * home页面， 显示socket连接情况
   */
  router.get('/', controller.home.index);

  /**
   * 服务存活接口
   */
  router.get('/healthy', controller.healthy.healthy);

  /**
   * io路由
   */
  require('./router/io');
};
