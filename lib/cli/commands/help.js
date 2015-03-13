var prompt = require('../prompt');
var format = require('string-template');

function showUsage(app, usage) {
  usage.forEach(function(line) {
    app.logger.info(line);
  });
}

function showOptionInfo(app) {
  var lines = prompt.usageOptionsInfo;
  if (lines.length) {
    app.logger.info('');
    lines.forEach(function(line) {
      app.logger.info(line);
    });
  }
}

module.exports = {
  handle: function(callback, commandName) {
    if (commandName != null) {
      try {
        var usage = require('./' + commandName).usage;
        this.logger.info('Usage information for {0}:\n', commandName.magenta);
        showUsage(this, usage);
        this.logger.info();
        callback();
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          err.message = format('unknown command "{0}"', commandName);
          err.code = 'UNKNOWN_COMMAND';
        }
        callback(err);
      }
    } else {
      showUsage(this, this.usage);
      this.logger.info([
        '',
        'Type "ystat help [command]" to get more information about a command',
      ]);
      showOptionInfo(this);
      callback();
    }
  },
  description: 'Shows usage and help information',
  usage: [
      'For detailed help information of any other command:',
      '    ystat help [command]'
  ]
};
