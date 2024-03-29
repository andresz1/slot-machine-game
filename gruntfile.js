module.exports = function(grunt) {
  var paths = {
    assets: {
      cwd: 'src/',
      src: 'assets/**'
    },
    css: 'src/css/*.css',
    js: 'src/js/**/*.js',
    build: './build/'
  };

  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '0.0.0.0',
          base: 'src'
        }
      }
    },
    clean: {
      build: {
        src: paths.build
      }
    },
    copy: {
      assets: {
        cwd: paths.assets.cwd,
        src: paths.assets.src,
        dest: paths.build,
        expand: true
      }
    },
    uglify: {
      src: {
        files: [{
          src: paths.js,
          dest: paths.build + 'main.min.js'
        }]
      }
    },
    cssmin: {
      src: {
        files: [{
          src: paths.css,
          dest: paths.build + 'main.min.css'
        }]
      }
    },
    processhtml: {
      src: {
        files: [{
          src: 'src/index.html',
          dest: paths.build + 'index.html'
        }]
      }
    },
    htmlmin: {
      src: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          src: paths.build + 'index.html',
          dest: paths.build + 'index.html'
        }]
      }
    },
    compress: {
      src: {
        options: {
          archive: 'build.zip'
        },
        files: [{
          src: paths.build + '**/*',
          dest: './'
        }]
      }
    },
    watch: {
      src: {
        options: {
          livereload: true
        },
        files: ['./src/index.html',
          paths.css,
          paths.js
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', [
    'connect',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy:assets',
    'uglify',
    'cssmin',
    'processhtml',
    'htmlmin'
  ]);

  grunt.registerTask('zip', [
    'build',
    'compress'
  ]);
};
