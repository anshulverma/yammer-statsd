module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      allFiles: [
        'Gruntfile.js',
        'index.js',
        'lib/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        force: true
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};
