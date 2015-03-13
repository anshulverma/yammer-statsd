var fs = require('fs');
var path = require('path');

var usage = [
  'Usage:'.cyan.bold.underline,
  '',
  '  ystat [options] [command] [arguments]',
  '',
  'Available Commands:'.cyan.bold.underline,
  ''
];

var commandsDir = path.join(__dirname, 'commands');
fs.readdirSync(commandsDir).forEach(function(commandFileName) {
  var commandName = commandFileName.split('.')[0];
  var command  = require('./commands/' + commandName);
  var description = command.description;

  usage.push(commandName.green + ': ' + description);
});

module.exports = usage;
