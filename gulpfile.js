'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const historyApiFallback = require('connect-history-api-fallback');

const stylus = require('gulp-stylus');
const nib = require('nib');

const jshint = require('gulp-jshint');

const inject = require('gulp-inject');
const wiredep = require('wiredep').stream;

function serverSetup() {
    connect.server({
        root: ['./app'],
        hostname: '0.0.0.0',
        port: 8080,
        livereload: true,
        middleware: function() {
            return [historyApiFallback({})];
        }
    });
}

function stylusReload() {
    gulp.src('./app/css/stylus/style.styl')
        .pipe(stylus({
            use: nib(),
            compress: true
        }))
        .pipe(gulp.dest('./app/css'))
        .pipe(connect.reload());
}

function htmlReload() {
    gulp.src('./app/**/*.html')
        .pipe(connect.reload());
}

function jsHint() {
    return gulp.src(['./app/js/main.js', './gulpfile.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
}

function watchFiles() {
    gulp.watch(['./app/**/*.html'], ['html']);
    gulp.watch(['./app/css/stylus/**/*.styl'], ['stylus', 'inject']);
    gulp.watch(['./app/js/**/*.js', './gulpfile.js'], ['jshint', 'inject']);
    gulp.watch(['./bower.json'], ['wiredep']);
}

function injectFiles() {
    var sources = gulp.src(['./app/js/**/*.js', './app/css/**/*.css', '!./app/js/vendor/**/*.js'], {read: false});
    return gulp.src('./app/index.html')
        .pipe(inject(sources, {
            ignorePath: '/app'
        }))
        .pipe(gulp.dest('./app'));
}

function injectBower() {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: './app/lib'
        }))
        .pipe(gulp.dest('./app'));
}

// Servidor Web de desarrollo
gulp.task('server', serverSetup);

// Proprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('stylus', stylusReload);

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', htmlReload);

// Busca errores de JS y nos lo muestra por pantalla
gulp.task('jshint', jsHint);

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado para inyectarlos en el index.html
gulp.task('inject', injectFiles);

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', injectBower);

// Vigila cambios que se produzcan en el codigo y lanza las tareas relacionadas
gulp.task('watch', watchFiles);

// Carga los cambios cuando se inicia Gulp
gulp.task('start', ['html', 'stylus', 'jshint', 'inject', 'wiredep']);

// Default tarea de Gulp
gulp.task('default', ['server', 'start', 'watch']);
