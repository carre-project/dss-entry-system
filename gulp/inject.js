'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var replace = require('gulp-replace');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('inject', ['scripts'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/*.config.'+(process.env.NODE_ENV==='production'?'dev':'prod')+'.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    
    
    .pipe(replace('CARRE_ENTRY_SYSTEM_LANGUAGE', process.env.CARRE_ENTRY_SYSTEM_LANGUAGE))
    .pipe(replace('CARRE_ENTRY_SYSTEM_API_URL', process.env.CARRE_ENTRY_SYSTEM_API_URL))
    .pipe(replace('CARRE_ENTRY_SYSTEM_GRAPH_URL', process.env.CARRE_ENTRY_SYSTEM_GRAPH_URL))
    .pipe(replace('CARRE_ENTRY_SYSTEM_AUTH_URL', process.env.CARRE_ENTRY_SYSTEM_AUTH_URL))
    
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
