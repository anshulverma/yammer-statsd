require('colors'); // enabling string coloring

var flatiron = require('flatiron'),
    winston = require('winston'),
    path = require('path'),
    utils = require('../utils');

var app = flatiron.app;
app.version = require('../../package.json').version;

app.use(flatiron.plugins.cli, {
  usage: require('./usage'),
  version: true,
  argv: {
    url: {
      description: 'metric url',
      alias: 'r',
      string: true
    },
    'login-url': {
      description: 'login url',
      alias: 'l',
      string: true
    },
    'auth-type': {
      description: 'authentication type',
      alias: 'a',
      string: true
    },
    user: {
      description: 'user name',
      alias: 'u',
      string: true
    },
    password: {
      description: 'password',
      alias: 'p',
      string: true
    },
    metric: {
      description: 'metric name',
      alias: 'm',
      string: true
    },
    help: {
      description: 'print this help information',
      alias: 'h'
    },
    version: {
      description: 'prints version information',
      alias: 'v'
    }
  },
  dir: path.join(__dirname, 'commands'),
  notFoundUsage: true,
  prompt: {
    message: 'ystat'.cyan,
    delimiter: ' : '.green,
    override: true,
    properties: {
      user: {
        description: 'Enter username',
        type: 'string',
        pattern: /^[a-zA-Z]+$/,
        message: 'username must only contain letters'
      },
      password: {
        description: 'Enter password',
        type: 'string',
        pattern: /^[a-zA-Z0-9]+$/,
        message: 'password must only contain letters or numbers',
        hidden: true
      },
      metric: {
        description: 'Enter metric name',
        type: 'string',
        required: true
      },
      url: {
        description: 'Enter metric URL',
        type: 'string',
        required: true
      },
      'login-url': {
        description: 'Enter login URL',
        type: 'string',
        required: true
      },
      'auth-type': {
        description: 'Enter authentication type',
        type: 'string',
        pattern: /^url$/,
        message: 'supported authentication types are: "url"',
        required: true
      }
    }
  }
});

app.ready = false;

app.start = function(callback) {
  app.options.log = {
    transports: [
      new (winston.transports.Console)({ formatter: utils.logFormatter })
    ]
  };

  return app.init(function(err) {
    var minor;
    app.welcome();

    if (err != null) {
      app.showError(app.argv._.join(' ', err));
      return callback(err);
    }
    minor = process.version.split('.')[1];
    if (parseInt(minor, 10) % 2) {
      app.log.warn('You are using unstable version of node.js. You may experience problems.');
    }
    return app.exec(app.argv._, callback);
  });
};

app.exec = function(command, callback) {
  var execCommand = function(err) {
    if (err) {
      return callback(err);
    }
    var fullCommand = command.join(' ');
    if (fullCommand) {
      app.log.info('Executing command ' + fullCommand.magenta);
    }

    return app.router.dispatch('on', fullCommand, app.log, function(err, shallow) {
      if (err != null) {
        app.showError(fullCommand, err, shallow);
        return callback(err);
      }
      return callback();
    });
  };
  try {
    if (app.ready) {
      return execCommand();
    } else {
      return app.setup(execCommand);
    }
  } catch (error) {
    return app.showError(command.join(' '), error);
  }
};

app.setup = function(callback) {
  if (app.ready === true) {
    return callback();
  }
  app.ready = true;
  return callback();
};

app.welcome = function() {
  return app.log.info('Welcome to ' + 'YStat'.grey + ' utility');
};

app.showError = function(command, err) {
  app.log.error('Error: ' + 'Unable to execute "' + command + '" [ ' + err.message + ' ]');
  return app.log.error(err.stack);
};

module.exports = {
  start: function(callback) {
    app.start(callback, app.log);
  },
  info: function(message) {
    app.log.info(message);
  },
  error: function(message) {
    app.log.error(message);
  }
};
