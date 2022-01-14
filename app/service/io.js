'use strict';
const _ = require('lodash');
const Service = require('egg').Service;
const {rst, base} = require('ntms-nodejs-base');
const constant = require('../common/constant');
const moment = require('moment');
const safeStringify = require('fast-safe-stringify');

/**
 * IO操作服务类
 */
class IoService extends Service {

  /**
   * 通过webSocket
   * @param msg.Token token
   * @param msg.ClientType 登录类型
   * @param msg.City 城市
   * @returns {*}
   * @private
   */
  async loginClents(msg) {
    let data;
    if (constant.CLIENT_TYPE[0] === msg.ClientType) {
      //1. 如果是Dispatcher 类型， 通过查表判断token是否有效
      //
      // //查询隧道表， 效验token
      // const fac = await this.ctx[`model_${msg.City}`].Fac.findOne({
      //   where: {
      //     Token: msg.Token
      //   },
      //   raw: true
      // });
      //
      // if (_.isEmpty(fac)) throw rst.error(403, 'Token无效');
      // if (moment().isAfter(fac.TokenExpireTime)) throw rst.error(403, 'Token有效期失效');
      // data = fac;  //赋值传入设置方法
    } else if (constant.CLIENT_TYPE[1] === msg.ClientType) {
      //2. 如果是web类型， 通过查redis判断token是否有效
      // TODO 待web端 登录模型成功后，写入
    } else {
      throw rst.error(403, '未知登录类型');
    }
    await this._setLogin(msg, data);
  }

  /**
   * 设置登录之后的信息
   * @param msg 传入的数据
   * @param data 查询后的数据
   * @private
   */
  async _setLogin(msg, data) {
    const nsp = this.app.io.of('/');
    const loginClient = nsp.adapter.loginClient  // 目前登录的client

    const obj = {
      action: 'login',
      ...loginClient
    };

    if (msg.ClientType === constant.CLIENT_TYPE[0]) {
      // Dispatcher 类型  moment().zone(8)
      const subInfo = {
        SocketId: this.ctx.socket.id,
        SubstationNo: _.toNumber(msg.ClientNo),
        LoginTime: moment().format(constant.MOMENT_TYPE.NORMAL),
        HealthyTime: moment().format(constant.MOMENT_TYPE.NORMAL),
        Host : this.ctx.socket.handshake.headers.host,
      };
      obj.message = `client type Dispatcher id:(${this.ctx.socket.id}) logined.`;
      obj.subClent.push(subInfo);
    } else if (msg.ClientType === constant.CLIENT_TYPE[1]) {
      //WebClient 类型
      const webInfo = {
        SocketId: this.ctx.socket.id,
        LoginTime: moment().format(constant.MOMENT_TYPE.NORMAL),
        HealthyTime: moment().format(constant.MOMENT_TYPE.NORMAL),
        Host : this.ctx.socket.handshake.headers.host,
      };
      obj.message = `client type WebClient id:(${this.ctx.socket.id}) logined.`;
      obj.webClent.push(webInfo);
    }

    this.sendOnline(obj);

    //如果有，就更新， 没有就写入
    // 写入的模型 #online{
    //   "web_Clent":[{FacLoginID:'123',SocketId:'123'}],
    //   "sub_Clent":[{FacilityID:'123',SocketId:'123'}],
    //   "message": "User(oZjC6pA4foMRoyBDAAAC) joined."
    // }
    //写入后，群通知
    // web_Clent:{
    //  SocketId,LoginTime,IP,Port
    // }
    // sub_Clent:{
    //  SocketId,LoginTime,SubstationNo
    // }

  }

  /**
   * 发送在线消息，通知#online 订阅
   * @param obj
   */
  sendOnline(obj){
    const nsp = this.app.io.of('/');

    nsp.adapter.clients([this.app.config.io.room.substation], (err, clients) => {
      // 更新在线用户列表
      obj.clients = clients;
      nsp.to([`${this.app.config.io.room.substation}`]).emit('online', obj);
    });
  }

  /**
   * 处理心跳检查
   */
  checkHeartBeat(){
    const nsp = this.app.io.of('/');
    const loginClient = nsp.adapter.loginClient  // 目前登录的client
    console.log("登陆的客户端：",loginClient);
    let overtimeArr = []; //超时数组

    /**
     * 处理数组
     * @param arr
     */
    const checkClientList = (arr) => {
      _.forEach(arr,one=>{
        console.log("健康时间",one.HealthyTime+"peizhi:"+this.config.HealthyTime);
        //判断是否超时
        if(moment().isAfter(moment(one.HealthyTime).add(this.config.HealthyTime,'m'))){
          overtimeArr.push(one);
        }
      });
    }

    checkClientList(loginClient.webClent);
    checkClientList(loginClient.subClent);
    this.tickClients(overtimeArr);

    return overtimeArr.length;
  }

  /**
   * 提出对象
   * @param overtimeArr
   */
  tickClients (overtimeArr){
    const nsp = this.app.io.of('/');
    const loginClient = nsp.adapter.loginClient  // 目前登录的client

    _.forEach(overtimeArr,myClient=>{
      let type = myClient.SubstationNo ? 'sub':'web';
      if(type === 'sub'){
        _.pull(loginClient.subClent,myClient);
      }else {
        _.pull(loginClient.webClent,myClient);
      }

      // 在线列表
      nsp.adapter.clients([this.app.config.io.room.substation], (err, clients) => {
        // 更新在线用户列表
        nsp.to(this.app.config.io.room.substation).emit('online', {
          action: 'HeartBeat-overTime',
          ...nsp.adapter.loginClient,
          clients,
          message: `client id:(${myClient.SocketId}) heartBeat overTime and ticked.`,
        });

        // 踢出用户前发送消息
        nsp.emit(myClient.SocketId, {
          action: 'HeartBeat-overTime',
          message: `you client id:(${myClient.SocketId}) has be ticked!!!`,
        });

        nsp.adapter.del(myClient.SocketId, this.app.config.io.room.substation, err => {
          if(err) this.ctx.app.logger.info("踢人如果有错误：",err);
        });

      });

    });
  }

}

module.exports = IoService;
