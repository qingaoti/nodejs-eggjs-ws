'use strict';

const {rst} = require('ntms-nodejs-base');
const constant = require('../../common/constant');
const _ = require('lodash');

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const nsp = app.io.of('/');
    // const query = socket.handshake.query;   //暂时不用了

    //提出方法，内部调用
    const tick = (id, msg) => {
      logger.debug('#tick', id, msg);

      // 踢出用户前发送消息
      socket.emit(id, helper.parseMsg('deny', msg));

      // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
      nsp.adapter.remoteDisconnect(id, true, err => {
        logger.error(err);
      });
    };

    console.log('#auth:', socket.id);

    // 用户加入
    socket.join(app.config.io.room.substation);

    // 在线列表
    nsp.adapter.clients([app.config.io.room.substation], (err, clients) => {
      console.log('#online_join', clients);

      // 更新在线用户列表
      nsp.to(app.config.io.room.substation).emit('online', {
        action: 'join',
        ...nsp.adapter.loginClient,
        clients,
        message: `new client id:(${socket.id}) joined.`,
      });
    });

    // const message = ctx.packet[1];  // 参数

    // if(action !== 'Login'){
    //   const webClentRes = _.find(loginClient.webClent,{SocketId:socket.id});
    //   const subClentRes = _.find(loginClient.subClent,{SocketId:socket.id});
    //   if( _.isEmpty(webClentRes) && _.isEmpty(subClentRes)){
    //     throw rst.error(403, '未登录，无法此消息');
    //   }
    // }

    await next();

    //----------------------离开房间----------------------//
    console.log(`离开房间: id ${socket.id}`);
    const loginClient = nsp.adapter.loginClient;
    const webClentRes = _.find(loginClient.webClent,{SocketId:socket.id});
    const subClentRes = _.find(loginClient.subClent,{SocketId:socket.id});
    let myClient = webClentRes || subClentRes;
    if(myClient){
      //如果存在 ， 去掉
      //var result = lodash.pull(rooms,lodash.find(rooms,name:'test'}));
      // myClient.SubstationNo ? 'Dispatcher':'WebClient'
      let type = myClient.SubstationNo ? 'sub':'web';
      if(type === 'sub'){
        _.pull(loginClient.subClent,myClient);
      }else {
        _.pull(loginClient.webClent,myClient);
      }
    }

    // 在线列表
    nsp.adapter.clients([app.config.io.room.substation], (err, clients) => {
      // 更新在线用户列表
      nsp.to(app.config.io.room.substation).emit('online', {
        action: 'leave',
        ...nsp.adapter.loginClient,
        clients,
        message: `client id:(${socket.id}) leave.`,
      });
    });

    // 在线列表
    // nsp.adapter.clients([query.room], (err, clients) => {
    //   // 获取 client 信息
    //   // const clientsDetail = {};
    //   // clients.forEach(client => {
    //   //   const _client = app.io.sockets.sockets[client];
    //   //   const _query = _client.handshake.query;
    //   //   clientsDetail[client] = _query;
    //   // });
    //
    //   // 更新在线用户列表
    //   nsp.to(query.room).emit('online', {
    //     clients,
    //     action: 'leave',
    //     target: 'participator',
    //     message: `User(${socket.id}) leaved.`,
    //   });
    // });

  };
};
