'use strict';

const Controller = require('egg').Controller;
const constant = require('../../common/constant');
const _ = require('lodash');
const {rst} = require('ntms-nodejs-base');
const moment = require('moment');

class NspController extends Controller {
  //socket.emit('exchange', {
  //   target: ["JT23L6BB6h5nDra4AAAB"],
  //   payload: {
  //     msg : 'test1111',
  //   },
  // });
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};

    console.log("exchange:",message);

    const socket = ctx.socket;
    const client = socket.id;

    try {
      const { target, payload } = message;
      if (!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }

  /**
   * 登录客户端
   * @returns {Promise<void>}
   */
  async loginClents(){
    const nsp = this.app.io.of('/');
    const message = this.ctx.args[0] || {};

    console.log("Login:",message);

    if (_.isEmpty(message.City)) throw rst.error(403, '城市不能为空');
    // if (!_.includes(this.app.config.sequelize.databaseList, message.City)) throw rst.error(403, '没有该城市的数据库');

    if (_.isEmpty(message.ClientType)) throw rst.error(403, '登录类型不能为空');
    if (!_.includes(constant.CLIENT_TYPE,message.ClientType)) throw rst.error(403, '未知登录类型');
    // //如果登录类型 是WEB ， 从header取 Token
    // if(constant.CLIENT_TYPE[1] === message.ClentType){
    //   message.Token = this.ctx.header.Token;
    // }
    if (_.isEmpty(message.Token)) throw rst.error(403, 'Token不能为空');

    const result = await this.ctx.service.io.loginClents(message);
    this.ctx.body = rst.getResult(result);
  }

  async dataHandle() {
    const nsp = this.app.io.of('/');
    const loginClient = nsp.adapter.loginClient;  // 目前登录的client
    const message = this.ctx.args[0] || {};  //发送的消息体
    const id = this.ctx.socket.id;  // socket
    let myClient;   //直接的客户端

    console.log("Data:",message);

    //效验权限 ， 并且拿到自己的客户端
    const webClentRes = _.find(loginClient.webClent,{SocketId:this.ctx.socket.id});
    const subClentRes = _.find(loginClient.subClent,{SocketId:this.ctx.socket.id});
    if( _.isEmpty(webClentRes) && _.isEmpty(subClentRes)){
      throw rst.error(403, '未登录，无法发送此消息');
    }
    myClient = webClentRes || subClentRes;

    //{
    //   MsgNo:1, --消息编号
    //   MessageType:1, --消息类型
    //   Data:object    --消息数据体
    //   Time:"2021-05-08 11:24:59"   --时间
    // }
    switch (message.MessageType) {
      case 'HeartBeat':
        console.log("my",myClient);
        myClient.HealthyTime = moment().format(constant.MOMENT_TYPE.NORMAL);
        this.ctx.service.io.sendOnline({
          action: 'heartBeat',
          ...loginClient,
          message: `client type ${myClient.SubstationNo ? 'Dispatcher':'WebClient'} id:(${id}) heartbeated.`
        });
        // 根据发送心跳的 socketId 找到登录状态healthyTime 刷新成最新的时间
        break;
      case 'Control':
        // 控制的模型： {
        // "DeviceID":"0xssss", 设备ID
        // "SubstationNo":1,
        // "Action":1,  动作 eg: 开、关、消音、复位、无人机前进、后退等
        // }
        //tosomething;
        // 找到所有 sub_clent
        // 发送

        let findList = _.filter(loginClient.subClent,{SubstationNo:message.Data.SubstationNo})
        let arrSubIds = _.map(findList,'SocketId');
        console.log("Control：",arrSubIds);
        console.log("message:", message);
        nsp.to(arrSubIds).emit('Data', message);
        // nsp.to(test).emit('Data', message);
        // nsp.emit(arrSubIds,  message);

        // console.log("test:", test);
        // const namespace = this.app.io.of('/'); //获取命名空间 "/"
        // console.log(namespace);
//namespace.sockets ：连接到该命名空间的所有客户端，形式为 {id1:socket1, id2:socket2}
//通过 socket.id 就可以向该namespace下的指定客户端发送消息
//         namespace.sockets[test.SocketId].emit('Data', message);


        // 实例代码
        // nsp.adapter.data.sub_clent  //如果是写内存， 在这里取
        // 找到 子站 编号是 SubstationNo ： 1 的

        // nsp.emit([sub_clent], msg);   //给指定clent ids 发，
        // msg:{
        // "DeviceID":"0xssss", 设备ID
        // "SubstationNo":1,
        // "Action":1,  动作 eg: 开、关、消音、复位、无人机前进、后退等
        // }

        // nsp.adapter.clients([`${this.app.config.io.room.substation}`], (err, clients) => {
        //   // 更新在线用户列表
        //   nsp.to([`${this.app.config.io.room.substation}`]).emit('online', obj);
        // });
        break;
      case 'FrontSubStatusChange':
        //{
        // "FrontNo":1,  --前置子站编号
        // "Status":true|false, --状态  是否在线
        // "Time":""   --状态变化时间
        // }
        let arrWebIds = _.map(loginClient.webClent,'SocketId');
        console.log("FrontSubStatusChange：",arrWebIds);
        nsp.to(arrWebIds).emit('Data', message);
        break;
    }
  }

}

module.exports = NspController;
