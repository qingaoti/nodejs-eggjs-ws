'use strict';
const {errorMiddleware} = require('ntms-nodejs-base');
module.exports = (options, app) => {
  return errorMiddleware(app.config, app);
};
