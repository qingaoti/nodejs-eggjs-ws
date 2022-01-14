module.exports = app => {
  // IO 创建房间
  app.beforeStart(async () => {
    const nsp = app.io.of('/');
    nsp.adapter.loginClient = {
      webClent:[],
      subClent:[]
    }
  });

};
