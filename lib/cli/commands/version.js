module.exports = {
  handle: function() {
    console.dir(arguments);
  },
  description: 'Print version information',
  usage: [
      'Get the version of ystat:',
      '    ystat [-v | --version | version]'
  ]
};
