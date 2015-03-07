function showUsage(app) {
  app.usage.forEach(function (line) {
    app.log.help(line);
  });

  var lines = app.showOptions().split('\n').filter(Boolean);
  if (lines.length) {
    app.log.help('');
    lines.forEach(function (line) {
      app.log.help(line);
    });
  }
}

module.exports = function(callback) {
  showUsage(this);
  callback();
};

module.exports.description = 'Shows usage and help information';