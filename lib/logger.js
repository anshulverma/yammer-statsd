var winston = require('winston');
var util = require('util');
var moment = require('moment-timezone').tz('America/Los_Angeles');
var format = require('string-template');

function fileFormatter(args) {
  var message = args.message || '';
  var level = args.level;

  if (level === 'warn' || level === 'info') {
    message = message.slice(3);
  } else if (level === 'error') {
    message = message.slice(2);
  }
  return util.format('%s %s %s', moment.format('YYYY-MM-DDTHH:MM:ss.SSSZZ'), level.toUpperCase(), message);
}

function consoleFormatter(args) {
  var message = args.message || '';
  var level = args.level;

  if (level === 'warn' || level === 'info') {
    message = message.slice(3);
  } else if (level === 'error') {
    message = message.slice(2);
  }
  return message;
}

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: false,
      json: false,
      colorize: true,
      showLevel: false,
      formatter: consoleFormatter
    }),
    new winston.transports.File({
      filename: 'ystat.log',
      handleExceptions: true,
      json: false,
      colorize: true,
      showLevel: false,
      formatter: fileFormatter,
      tailable: true,
      maxSize: 1024 * 1024, // 1MB
      maxFiles: 30
    })
  ],
  exitOnError: false
});

logger.cli();

function log(message, logger, args) {
  if (Array.isArray(message)) {
    message.forEach(function(part) {
      log(part, logger, args);
    });
  } else {
    var clonedArgs = args.slice(0);
    clonedArgs.unshift(message);
    logger(format.apply({}, clonedArgs));
  }
}

module.exports = {
  info: function(message) {
    log.apply(this, [message || '', logger.info, [].splice.call(arguments, 1)]);
  },
  error: function(message) {
    log.apply(this, [(message || '').red, logger.error, [].splice.call(arguments, 1)]);
  }
};
