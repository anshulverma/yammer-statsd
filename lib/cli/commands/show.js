var utils = require('../../utils'),
    request_handler = require('../../request_handler');

module.exports = function(callback) {
  var app = this,
      user = app.argv.user,
      password = app.argv.password,
      loginUrl = app.argv.loginUrl,
      authEnabled = typeof user === 'string' ||
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
    var handler = request_handler.newRequestHandler(options);
    handler.getMetric(params.metric, function(err, metric) {
      if (err) {
        return callback(err);
      }
      app.log.info('done');
    });
  });
};

module.exports.usage = [
  '',
  'Get the value of a metric.',
  'This does not send the metric to statsd.'
];

module.exports.description = 'Shows value for a metric';