module.exports = {
  handle: function(callback) {
    console.dir(arguments);
    callback();
  },
  description: 'Print version information',
  usage: [
      'Get the version of ystat:',
      '    ystat [-v | --version | version]'
  ]
};
