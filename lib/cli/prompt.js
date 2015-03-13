var prompt = require('prompt'),
    config = require('./config'),
    format = require('string-template');

var promptProperties = {};
var optimistOptions = {};
for (var param in config) {
  var property = config[param];
  if (property.hasOwnProperty('prompt')) {
    var properties = {
          description: property.prompt.message,
          type: property.prompt.type,
          pattern: new RegExp(property.prompt.pattern),
          message: property.prompt.hint,
          required: true
    };
    promptProperties[param] = properties;
    promptProperties[property.alias] = properties;
    delete property.prompt;
  }
  optimistOptions[param] = property;
}

var optimist = require('optimist').string('_').options(optimistOptions);
var argv = optimist.argv;
prompt.properties = promptProperties;
prompt.override = argv;
prompt.message = 'ystat'.cyan;
prompt.delimiter = ' : '.green;

function buildContext(options) {
  options.serialize = function() {
    return format('{command}[{arguments}]', {
      command: options.command,
      arguments: (this.args || []).toString()
    });
  };
  return options;
}

function buildUsageOptionsInfo() {
  return optimist.help().split('\n');
}

module.exports = {
  get: function(params, callback) {
    prompt.get(params, callback);
  },
  getCommandContext: function(callback) {
    prompt.get('_', function(err, results) {
      if (err) {
        return callback(err);
      }
      var args = results['_'];
      var command = args.shift();
      callback(null, buildContext({
        command: command || '',
        args: args,
        version: argv.version,
        help: argv.help
      }));
    });
  },
  start: function() {
    prompt.start();
  },
  usageOptionsInfo: buildUsageOptionsInfo()
};
