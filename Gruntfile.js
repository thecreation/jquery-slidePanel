'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.

        // -- clean config ----------------------------------------------------------=
        clean: {
            files: ['dist']
        },

        // -- concat config ----------------------------------------------------------
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true,
                process: true
            },
            dist: {
                src: [
                    'src/intro.js',
                    'src/setup.js',

                    // helpers
                    'src/helpers/frame.js',
                    'src/helpers/support.js',
                    'src/helpers/functions.js',
                    'src/helpers/easing.js',

                    // core
                    'src/options.js',
                    'src/view.js',
                    'src/loading.js',
                    'src/animate.js',
                    'src/drag.js',
                    'src/instance.js',

                    'src/private.js',
                    'src/api.js',
                    'src/outro.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        // -- uglify config ----------------------------------------------------------
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
        },

        // -- jshint config ----------------------------------------------------------
        jshint: {
            gruntfile: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'src/.jshintrc'
                },
                src: '<%= concat.dist.dest %>'
            }
        },

        // -- jsbeautifier config -----------------------------------------------------
        jsbeautifier: {
            files: ['Gruntfile.js', "src/**/*.js", "<%= concat.dist.dest %>"],
            options: {
                "indent_size": 4,
                "indent_char": " ",
                "indent_level": 0,
                "indent_with_tabs": false,
                "preserve_newlines": true,
                "max_preserve_newlines": 10,
                "jslint_happy": false,
                "brace_style": "collapse",
                "keep_array_indentation": false,
                "keep_function_indentation": false,
                "space_before_conditional": true,
                "eval_code": false,
                "indent_case": false,
                "unescape_strings": false
            }
        },

        // -- watch config ------------------------------------------------------------
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            src: {
                files: '<%= concat.dist.src %>',
                tasks: ['concat:dist']
            }
        },

        // -- less config ------------------------------------------------------------
        less: {
            dist: {
                files: {
                    'css/slidePanel.css': ['less/slidePanel.less']
                }
            }
        },

        // -- autoprefixer config ----------------------------------------------------
        autoprefixer: {
            options: {
                browsers: [
                    "Android 2.3",
                    "Android >= 4",
                    "Chrome >= 20",
                    "Firefox >= 24",
                    "Explorer >= 8",
                    "iOS >= 6",
                    "Opera >= 12",
                    "Safari >= 6"
                ]
            },
            src: {
                expand: true,
                cwd: 'css/',
                src: ['*.css', '!*.min.css'],
                dest: 'css/'
            }
        },

        // -- csscomb config ---------------------------------------------------------
        csscomb: {
            dist: {
                files: {
                    'css/slidePanel.css': ['css/slidePanel.css'],
                },
            }
        },

        // -- replace config ---------------------------------------------------------
        replace: {
            bower: {
                src: ['bower.json'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: /("version": ")([0-9\.]+)(")/g,
                    to: "$1<%= pkg.version %>$3"
                }]
            }
        }
    });

    // Load npm plugins to provide necessary tasks.
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    // Default task.
    grunt.registerTask('default', ['js', 'dist', 'css']);

    grunt.registerTask('dist', ['clean', 'concat:dist', 'jsbeautifier', 'uglify']);
    grunt.registerTask('js', ['concat:dist', 'jshint']);
    grunt.registerTask('css', ['less', 'autoprefixer', 'csscomb']);

    grunt.registerTask('dev', ['watch:src']);

    grunt.registerTask('version', [
        'replace:bower'
    ]);
};
