var async = require('async'),
    util = require('util'),
    moment = require('moment-timezone').tz('America/Los_Angeles');

module.exports.getParams = function(app, params, callback) {
  var getParamFns = {};
  params.forEach(function(param) {
    getParamFns[param] =
        function(callback) {
          app.prompt.get(param, function(err, result) {
            if (err != null) {
              return callback(err);
            }
            callback(null, result[param]);
          });
        };
  });
  async.series(getParamFns, function(err, results) {
    if (err != null) {
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports.buildOptions = function(app, params, authEnabled) {
  var options = {
    url: params.url,
    logger: app.log
  };

  if (authEnabled) {
    options.authenticate = true;
    options.loginUrl = params['login-url'];
    options.authType = params['auth-type'];
    options.user = params.user;
    options.password = params.password;
  }

  return options;
};

module.exports.logFormatter = function(args) {
  var message = args.message || '',
      level = args.level;
  if (level === 'warn' || level === 'info') {
    message = message.slice(3);
  } else if (level === 'error') {
    message = message.slice(2);
  }
  return util.format('%s %s %s', moment.format('YYYY-MM-DDTHH:MM:ss.SSSZZ'), level.toUpperCase(), message);
};

module.exports.sanitize = function(options) {
  var sanitized = options || {};
  sanitized.strictSSL = sanitized.strictSSL || false;
  return sanitized;
};
