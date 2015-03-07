module.exports.request = function(options, callback) {
  console.dir(options)
  callback(null, {metric: 'empty'});
};