'use strict';
const Controller = require('egg').Controller;
/**
 * 服务存活接口
 */
class HealthyController extends Controller{

  /**
   * 此接口只做服务存活监听使用
   */
  async healthy(){
    this.ctx.body = 'healthy';
  }
}

module.exports = HealthyController;
