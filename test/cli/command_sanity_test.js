var fs = require('fs'),
    path = require('path'),
    format = require('string-template'),
    assert = require('chai').assert;

var commandsDir = path.resolve(__dirname, '../../lib/cli/commands'),
    commands = [];
fs.readdirSync(commandsDir).forEach(function(commandFileName) {
  var commandName = commandFileName.split('.')[0];
  commands.push({
    name: commandName,
    executor: require(path.resolve(commandsDir, commandName))
  });
});

describe('test command sanity', function() {
  var command;

  beforeEach(function(done) {
    command = commands.shift();
    done();
  });

  function commandSanityTest() {
    assert.typeOf(command.executor.description, 'string',
        format('command "{0}" does not have a valid description', command.name));
    assert.typeOf(command.executor.usage, 'array',
        format('command "{0}" should have usage as an array', command.name));
    command.executor.usage.forEach(function(line, index) {
      assert.typeOf(line, 'string', format('command "{0}" has invalid usage line at {1}', command.name, index));
    });
  }

  for (var i = 0; i < commands.length; i++) {
    it('check if a command has description and usage info', commandSanityTest);
  }
});
