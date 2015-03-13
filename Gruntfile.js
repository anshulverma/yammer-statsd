module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      allFiles: [
        'Gruntfile.js',
        'bin/ystat',
        'lib/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        force: true
      }
    },
    mochaTest: {
      run: {
        options: {
          reporter: 'spec',
          quiet: false,
          clearRequireCache: true
        },
        src: ['test/**/*.js']
      }
    },
    jscs: {
      allFiles: [
        'Gruntfile.js',
        'bin/ystat',
        'lib/**/*.js',
        'test/**/*.js'
      ],
      options: {
        config: '.jscsrc.json'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('style', ['jshint', 'jscs']);
  grunt.registerTask('default', ['test', 'style']);
};
