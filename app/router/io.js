'use strict';

const clientMiddleware = require('../io/middleware/clientMiddleware');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {io} = app;

  //发送消息
  io.of('/').route('exchange', io.controller.nsp.exchange);

  //登录
  io.of('/').route('Login', io.controller.nsp.loginClents);

  //sendMsg
  io.of('/').route('Data', io.controller.nsp.dataHandle);
};
