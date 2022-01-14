'use strict';
const _ = require('lodash');
const {rst} = require('ntms-nodejs-base');
const constant = require('../../common/constant');

/**
 * client 权限判断中间件
 */
module.exports = () => {
  return async (ctx, next) =>  {
    const { app, socket } = ctx;
    // 必须是一个登录过的 webSocket id
    const nsp = app.io.of('/');
    const loginClient = nsp.adapter.loginClient  // 目前登录的client

    const id = socket.id;   // socket ID
    const action = ctx.packet[0];  // 参数
    const message = ctx.packet[1];  // 参数

    console.log("ctx:",ctx.packet);

    if(action !== 'Login'){
      const webClentRes = _.find(loginClient.webClent,{SocketId:id});
      const subClentRes = _.find(loginClient.subClent,{SocketId:id});
      if( _.isEmpty(webClentRes) && _.isEmpty(subClentRes)){
        throw rst.error(403, '未登录，无法此消息');
      }
    }

    socket.join(app.config.io.room.substation);

    await next();
    // switch (message.MessageType) {
    //   case 'Control':
    //
    //     break;
    // }
  };
};
