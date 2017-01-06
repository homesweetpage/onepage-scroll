'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var historyApiFallback = require('connect-history-api-fallback');

var stylus = require('gulp-stylus');
var nib = require('nib');

// Servidor Web de desarrollo
gulp.task('server', function() {
	connect.server({
		root: ['./app'],
		hostname: '0.0.0.0',
		port: 8080,
		livereload: true,
		middleware: function(connect, opt) {
			return [historyApiFallback({})];
		}
	});
});

// Proprocesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
	gulp.src('./app/css/stylus/style.styl')
		.pipe(stylus({use: nib()}))
		.pipe(gulp.dest('./app/css'))
		.pipe(connect.reload());
});

// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
	gulp.src('./app/**/*.html')
		.pipe(connect.reload());
});

// Vigila cambios que se produzcan en el codigo y lanza las tareas relacionadas
gulp.task('watch', function() {
	gulp.watch(['./app/**/*.html'], ['html']);
	gulp.watch(['./app/css/stylus/**/*.styl'], ['css']);
});

gulp.task('default', ['server', 'watch']);