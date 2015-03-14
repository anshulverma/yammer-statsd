require('colors'); // enabling string coloring

var prompt = require('./prompt');
var logger = require('../logger').cli;
var usage = require('./usage');
var router = require('./router');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var format = require('string-template');

var version = require('../../package.json').version;

function CLIApplication() {
  this.logger = logger;
  this.prompt = prompt;
  this.usage = usage;
}

util.inherits(CLIApplication, EventEmitter);

CLIApplication.prototype.start = function() {
  var self = this;

  this.showWelcomeMessage();

  function onComplete(err) {
    if (err != null) {
      self.emit('error', err);
    } else {
      self.emit('complete');
    }
  }

  prompt.start();
  prompt.getCommandContext(function(err, context) {
    if (err != null) {
      self.emit('error', err);
    } else {
      router.handle.call(self, context, onComplete);
    }
  });
};

CLIApplication.prototype.showWelcomeMessage = function() {
  logger.info(
      [
        '|   |                         '.cyan,
        '|   | ____  _____ _____ _____ '.cyan,
        '|___| |___    |   |___|   |   '.cyan,
        '  |       |   |   |   |   |   '.cyan,
        '  |   |___|   |   |   |   |   '.cyan,
        '',
        format('Yammer statsd utility v{0}', version),
        'https://github.com/anshulverma/yammer-statsd',
        ''
      ]);
};

module.exports = new CLIApplication();
