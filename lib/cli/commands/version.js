module.exports = {
  handle: function(callback) {
    this.logger.info(['CLI version: {version}', ''], this);
    callback();
  },
  description: 'Print version information',
  usage: [
      'Get the version of ystat:',
      '    ystat [-v | --version | version]'
  ]
};
