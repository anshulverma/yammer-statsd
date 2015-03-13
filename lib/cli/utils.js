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
