var winston = require('winston');
var moment = require('moment-timezone');
var format = require('string-template');

function fileFormatter(args) {
  var message = args.message || '';
  var level = args.level;
  var time =  moment.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:MM:ss.SSSZZ');
  return format('{time} {level} {message}', {
      time: time,
      level: level.toUpperCase(),
      message: message
    });
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

winston.loggers.add('cli', {
  console: {
    handleExceptions: true,
    json: false,
    colorize: true,
    showLevel: false,
    formatter: consoleFormatter,
    emitErrs: true,
    exitOnError: false
  }
});
winston.loggers.get('cli').cli();

winston.loggers.add('server', {
  file: {
    filename: 'ystat.log',
    handleExceptions: true,
    json: false,
    colorize: false,
    stripColors: true,
    showLevel: false,
    formatter: fileFormatter,
    tailable: true,
    maxSize: 1024 * 1024, // 1MB
    maxFiles: 30,
    emitErrs: true,
    exitOnError: false
  }
});

function log(message, logger, args) {
  if (Array.isArray(message)) {
    message.forEach(function(part) {
      log(part, logger, args);
    });
  } else {
    var clonedArgs = args.slice(0);
    clonedArgs.unshift(message);
    var line = format.apply({}, clonedArgs);
    logger(line);
  }
}

function wrapLogger(logger) {
  return {
    info: function(message) {
      log.apply(this, [message || '', logger.info, [].splice.call(arguments, 1)]);
    },
    error: function(message) {
      log.apply(this, [(message || '').red, logger.error, [].splice.call(arguments, 1)]);
    },
    onError: function(callback) {
      logger.on('error', callback);
    }
  };
}

module.exports = {
  cli: wrapLogger(winston.loggers.get('cli')),
  server: wrapLogger(winston.loggers.get('server'))
};
