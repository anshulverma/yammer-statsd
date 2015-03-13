var prompt = require('../prompt');

function showUsage(app, usage) {
  usage.forEach(function (line) {
    app.logger.info(line);
  });
}

function showOptionInfo(app) {
  var lines = prompt.usageOptionsInfo;
  if (lines.length) {
    app.logger.info('');
    lines.forEach(function (line) {
      app.logger.info(line);
    });
  }
}

module.exports = {
  handle: function (commandName) {
    if (commandName != null) {
      this.logger.info('Usage information for {0}:\n', commandName.magenta);
      showUsage(this, require('./' + commandName).usage);
      this.logger.info();
    } else {
      showUsage(this, this.usage);
      this.logger.info([
        '',
        'Type "ystat help [command]" to get more information about a command',
      ]);
      showOptionInfo(this);
    }
  },
  description: 'Shows usage and help information',
  usage: [
      'For detailed help information of any other command:',
      '    ystat help [command]'
  ]
};
