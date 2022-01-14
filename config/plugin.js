'use strict';

module.exports = {
  routerPlus : {
    enable: true,
    package: 'egg-router-plus',
  },

  /**
   * socket io
   */
  io : {
    enable: true,
    package: 'egg-socket.io',
  },
  /**
   * 页面组件
   */
  nunjucks : {
    enable: true,
    package: 'egg-view-nunjucks',
  }
};
