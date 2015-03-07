var fs = require('fs'),
    path = require('path');

var usage = [
  '|   |                         '.cyan,
  '|   | ____  _____ _____ _____ '.cyan,
  '|___| |___    |   |___|   |   '.cyan,
  '  |       |   |   |   |   |   '.cyan,
  '  |   |___|   |   |   |   |   '.cyan,
  '',
  'Yammer statsd utility',
  'https://github.com/anshulverma/yammer-statsd',
  '',
  'Usage:'.cyan.bold.underline,
  '',
  '  ystat { -v | -h } [command]',
  '',
  'Available Commands:'.cyan.bold.underline,
  '',
];

var commandsDir = path.join(__dirname, "commands");
fs.readdirSync(commandsDir).forEach(function(commandFileName) {
  var commandName = commandFileName.split('.')[0];
  var command  = require("./commands/" + commandName);
  usage.push(commandName.green + ': ' + command.description);
});

module.exports = usage;
