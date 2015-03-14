var help = require('../../lib/cli/commands/help');
var assert = require('chai').assert;

var testLogger = {
  info: function(message) {
    testLogger.buffer = testLogger.buffer + '\n' + 'info: ' + (message || '');
  },
  error: function(message) {
    testLogger.buffer = testLogger.buffer + '\n' + 'error: ' + (message || '');
  },
  on: function() { },
  buffer: ''
};

describe('help command tests', function() {

  beforeEach(function() {
    testLogger.buffer = '';
  });

  it('help command without param', function(done) {
    help.handle.call({
          logger: testLogger,
          usage: [
              'usage line 1',
              'usage line 2'
          ]
        },
        function(err) {
          assert.notOk(err != null, 'there was an error');
          assert.equal(testLogger.buffer,
                  '\n' +
                  'info: usage line 1\n' +
                  'info: usage line 2\n' +
                  'info: ,Type "ystat help [command]" to get more information about a command\n' +
                  'info: \n' +
                  'info: Options:\n' +
                  'info:   --url, -r        metric url                 \n' +
                  'info:   --login-url, -l  login url                  \n' +
                  'info:   --auth-type, -a  authentication type        \n' +
                  'info:   --user, -u       username                   \n' +
                  'info:   --password, -p   password                   \n' +
                  'info:   --metric, -m     metric name                \n' +
                  'info:   --help, -h       print this help information\n' +
                  'info:   --version, -v    print version information  \n' +
                  'info: ',
              'unexpected value in logger buffer');
          done();
        });
  });

  it('help command with param', function(done) {
    help.handle.call({
          logger: testLogger
        },
        function(err) {
          assert.isUndefined(err, 'there was an error');
          assert.equal(testLogger.buffer,
                  '\n' +
                  'info: Usage information for {0}:\n' +
                  '\n' +
                  'info: For detailed help information of any other command:\n' +
                  'info:     ystat help [command]\n' +
                  'info: ',
              'unexpected value in logger buffer');
          done();
        }, 'help');
  });
});
