var request = require('request');
var conditional = require('conditional');
var utils = require('./utils');

var MAX_LOGIN_ATTEMPT = 5;
var NOT_RETRYABLE = 1;
var RETRYABLE = 2;
var LOGIN_HANDLERS = {
      url : function(options, callback) {
        request(options.loginUrl, {
          followRedirect: false,
          jar: true,
          qs: {
            user: options.user,
            password: options.password
          },
          strictSSL: options.strictSSL
        }, function(err, response) {
          if (err != null) {
            callback(err, NOT_RETRYABLE);
          } else if (response.statusCode >= 500) {
            callback(new Error('unable to login, can retry'), RETRYABLE);
          } else if (response.statusCode >= 400) {
            callback(new Error('unable to login please check username/password'));
          } else {
            callback(null);
          }
        });
      }
    };

function RequestHandler(options) {
  this.options = utils.sanitize(options);
  this.isLoggedin = false;
  this.loginRetryCount = 0;
}

RequestHandler.prototype.login = function(callback) {
  var self = this;
  var loginHandler = LOGIN_HANDLERS[this.options.authType];

  if (this.loginRetryCount >= MAX_LOGIN_ATTEMPT) {
    return callback(new Error('unable to login after ' + MAX_LOGIN_ATTEMPT + ' attempts'));
  }

  conditional.checkDefined(loginHandler, 'no login handler found for auth type: ' + this.options.authType);

  this.options.logger.info('attempting to log in');
  loginHandler(this.options, function(err, retry) {
    if (err != null && retry === RETRYABLE) {
      self.loginRetryCount++;
      self.login(callback);
    } else if (err != null) {
      callback(err);
    } else {
      self.options.logger.info('successfully logged in after ' + (self.loginRetryCount + 1) + ' attempts');
      self.loginRetryCount = 0;
      self.isLoggedin = true;
      callback(null);
    }
  });
};

RequestHandler.prototype.getMetric = function(metricName, callback) {
  var self = this;

  conditional.checkDefined(metricName, 'metric name is undefined');

  this.options.logger.info('sending request to get metrics');
  this.sendRequest(function(err, metrics) {
    if (err != null) {
      return callback(err);
    }
    self.options.logger.info('metrics received');
    callback(null, metrics[metricName]);
  });
};

RequestHandler.prototype.sendRequest = function(callback) {
  var self = this;
  if (!this.isLoggedin) {
    this.login(function(err) {
      if (err != null) {
        callback(err);
      } else {
        self.doRequest(callback);
      }
    });
  } else {
    this.doRequest(callback);
  }
};

RequestHandler.prototype.doRequest = function(callback) {
  var self = this;

  function onComplete(err, data) {
    if (err != null) {
      return callback(err);
    }
    callback(null, data.metrics);
  }

  request(this.options.url, {
    followRedirect: false,
    jar: true,
    json: true,
    strictSSL: this.options.strictSSL
  }, function(err, response, data) {
    if (err != null) {
      callback(err);
    } else if (response.statusCode !== 200 && response.statusCode < 500) {
      self.login(function(err) {
        if (err != null) {
          return callback(err);
        }
        self.sendRequest(onComplete);
      });
    } else {
      onComplete(null, data);
    }
  });
};

module.exports.newRequestHandler = function(options) {
  return new RequestHandler(options);
};
