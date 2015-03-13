var format = require('string-template');

function handleError(err, context, callback) {
  var message;
  switch (err.code) {
    case 'MODULE_NOT_FOUND':
      err.message = format('command "{0}" not found', context.command);
      break;
    default:
      message = err.message;
  }
  callback(err);
}

module.exports = {
  handle: function(context, callback) {
    if (context.version) {
      context.command = 'version';
    } else if (context.help || context.command === '') {
      context.command = 'help';
    }

    try {
      require('./commands/' + context.command).handle.apply(this, context.args);
    } catch (e) {
      handleError(e, context, callback);
    }
    callback();
  }
};
