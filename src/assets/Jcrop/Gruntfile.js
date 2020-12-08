module.exports = function(grunt) {
  var jcrop_sources = [
    'src/intro.js',
    'src/constructor.js',
    'src/static.js',
    'src/stage/Abstract.js',
    'src/stage/Image.js',
    'src/stage/Canvas.js',
    'src/filter/BackoffFilter.js',
    'src/filter/ConstrainFilter.js',
    'src/filter/ExtentFilter.js',
    'src/filter/GridFilter.js',
    'src/filter/RatioFilter.js',
    'src/filter/RoundFilter.js',
    'src/filter/ShadeFilter.js',
    'src/component/CanvasAnimator.js',
    'src/component/CropAnimator.js',
    'src/component/DragState.js',
    'src/component/EventManager.js',
    'src/component/ImageLoader.js',
    'src/component/JcropTouch.js',
    'src/component/KeyWatcher.js',
    'src/component/Selection.js',
    'src/component/StageDrag.js',
    'src/component/StageManager.js',
    'src/component/Thumbnailer.js',
    'src/component/DialDrag.js',
    'src/defaults.js',
    'src/api.js',
    'src/plugin.js',
    'src/modernizr.js',
    'src/outro.js'
  ];
  var json = grunt.file.readJSON('package.json');
  grunt.initConfig({
    pkg: json,
    watch: {
      css: {
        files: [ 'src*.less' ],
        tasks: [ 'css' ]
      },
      js: {
        files: [ 'src*.js' ],
        tasks: [ 'js' ]
      }
    },
    concat: {
      options: {
        banner: '\n'
      },
      dist: {
        src: jcrop_sources,
        dest: 'js/<%= pkg.name %>.js'
      }
    },
    less: {
      dist: {
        files: {
          "css/Jcrop.css": "src/css/Jcrop.less"
        }
      }
    },
    cssmin: {
      dist: {
        options: {
          keepSpecialComments: 0,
          banner: '\n'
        },
        files: {
          "css/Jcrop.min.css": "css/Jcrop.css"
        }
      }
    },
    usebanner: {
      dist: {
        options: {
          banner: '\n'
        },
        files: {
          src: [ 'css/Jcrop.css' ]
        }
      }
    },
    uglify: {
      options: {
        banner: '\n'
      },
      dist: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-banner');
  grunt.registerTask('default', ['js','css']);
  grunt.registerTask('js', ['concat','uglify']);
  grunt.registerTask('css', ['less','cssmin','usebanner']);
};
