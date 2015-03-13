var utils = require('../../utils');
var format = require('string-template');
var requestHandler = require('../../request_handler');

module.exports = {
  handle: function(callback) {
    var app = this;
    var user = app.prompt.params.user;
    var password = app.prompt.params.password;
    var loginUrl = app.prompt.params.loginUrl;
    var authEnabled = typeof user === 'string' ||
        typeof password === 'string' ||
        typeof loginUrl === 'string';
    var requestParams = ['url', 'metric'];
    if (authEnabled) {
      requestParams.push('login-url');
      requestParams.push('auth-type');
      requestParams.push('user');
      requestParams.push('password');
    }
    utils.getParams(app, requestParams, function(err, params) {
      if (err != null) {
        return callback(err);
      }
      var options = utils.buildOptions(app, params, authEnabled);
      var handler = requestHandler.newRequestHandler(options);
      handler.getMetric(params.metric, function(err, metric) {
        if (err != null) {
          return callback(err);
        } else if (typeof metric !== 'object') {
          return callback(new Error(format('metric "{metric}" not found', params)));
        } else {
          app.logger.info('{0}[count]: {1}', params.metric, metric.count);
          return callback();
        }
      });
    });
  },
  description: 'Shows value for a metric',
  usage: [
    'Get the value of a metric.',
    'This does not send the metric to statsd.',
    '',
    'ystat --'
  ]
};
