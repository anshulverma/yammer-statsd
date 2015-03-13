var async = require('async');

// set up static definitions
(function() {
  Array.prototype.clone = function() {
    return this.slice(0);
  };
})();

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
    logger: app.logger
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

module.exports.sanitize = function(options) {
  var sanitized = options || {};
  sanitized.strictSSL = sanitized.strictSSL || false;
  return sanitized;
};
