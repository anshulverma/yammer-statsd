var utils = require('../../utils');
var requestHandler = require('../../request_handler');

module.exports = function(callback) {
  var app = this;
  var user = app.argv.user;
  var password = app.argv.password;
  var loginUrl = app.argv.loginUrl;
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
      if (err) {
        return callback(err);
      }
      app.log.info('%s[count]: %j', params.metric, metric.count);
    });
  });
};

module.exports = {
    description: 'Shows value for a metric',
    usage: [
      'Get the value of a metric.',
      'This does not send the metric to statsd.',
      '',
      'ystat --'
    ]
};
