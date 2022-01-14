const Subscription = require('egg').Subscription;
const constant = require('../common/constant');

class HeartBeatJob extends Subscription {
  constructor(props) {
    super(props);
  }

  static get schedule() {
    return {
      interval: `30s`,  // 轮训时间
      // cron: '0 0 14 * * ?',
      type: 'worker',
      immediate: false,
      // disable: process.env.RUN_ENV != 'EWS', //本地开发环境不执行
    };
  }

  async subscribe() {
    const {ctx} = this;
    ctx.app.logger.info(`定时任务[HeartBeat]执行`);
    if (!global.topdf_working) {
      try {
        const obj = await ctx.service.io.checkHeartBeat();
        ctx.app.logger.info(`定时任务执行完成,处理了${obj}个任务`);
      } catch (e) {
        this.app.logger.error(`定时任务出现未知异常： ${e}`);
      }
    }
  }
}

module.exports = HeartBeatJob;
