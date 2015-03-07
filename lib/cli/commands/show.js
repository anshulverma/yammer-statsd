var utils = require('../../utils'),
    handler = require('../../handler');

module.exports = function(callback) {
  var app = this,
      user = app.argv.user,
      password = app.argv.password,
      authEnabled = typeof user === 'string' || typeof password === 'string';

  var requestParams = ['url', 'metric'];
  if (authEnabled) {
    requestParams.push('user');
    requestParams.push('password');
  }
  utils.getParams(app, requestParams, function(err, results) {
    if (err != null) {
      return callback(err);
    }
    results.authenticate = authEnabled;
    handler.request(results, function(err, metric) {
      if (err != null) {
        return callback(err);
      }
      console.dir(metric);
      callback();
    });
  });
};

module.exports.usage = [
  '',
  'Get the value of a metric.',
  'This does not send the metric to statsd.'
];

module.exports.description = "Shows value for a metric";