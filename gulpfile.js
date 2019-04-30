// Project Details
//

let themename = "DotDev-Gulp"

// Modules
//

let gulp = require('gulp');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();
let sass = require('gulp-sass');
let cleanCSS = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');
let concat = require('gulp-concat');
let imagemin = require('gulp-imagemin');
let htmlmin = require('gulp-htmlmin');
let uglify = require('gulp-uglify');
let lineEndingCorrector = require('gulp-line-ending-corrector');

// File Structure / Location
//

let src = 'src/';
let dist = 'dist/';

// CSS / SASS
//

let cssSrc = src + 'sass/';
let cssDist = dist + 'css/';
let cssOrder = [
  cssSrc + 'typography.css',
  cssSrc + 'style.css'
];
let cssWatch = cssSrc + '**/*.scss';

function scss() {
  return gulp.src([cssSrc + '*.scss'])
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(lineEndingCorrector())
    .pipe(gulp.dest(cssSrc + 'css/'));
}

function css() {
  return gulp.src(cssSrc + 'css/*.css')
    .pipe(sourcemaps.init({
      loadMaps: true,
      largeFile: true
    }))
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(lineEndingCorrector())
    .pipe(gulp.dest(cssDist));
}

// JavaScript
//

let jsSrc = src + 'js/';
let jsDist = dist + 'js/';
let jsOrder = [
  jsSrc + 'init.js',
  jsSrc + 'common.js',
  jsSrc + 'animation.js',
]
let jsWatch = jsSrc + '*.js';

function javascript() {
  return gulp.src(jsWatch)
    .pipe(concat(themename + '.min.js'))
    .pipe(uglify())
    .pipe(lineEndingCorrector())
    .pipe(gulp.dest(jsDist));
}

// Images
//

let imgSrc = src + 'img/';
let imgDist = dist + 'img/';
let imgWatch = imgSrc + '**/*.*';

function images() {
  return gulp.src(imgWatch)
    .pipe(imagemin())
    .pipe(gulp.dest(imgDist));
}

// HTML
//

let htmlSrc = src + 'html/';
let htmlDist = dist;
let htmlWatch = htmlSrc + "*.html";

function html() {
  return gulp.src(htmlWatch)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(htmlDist))
    .pipe(browserSync.stream());
}

// Init
//
function init() {
  scss();
  css();
  javascript();
  html();
  images();
}

// Watch Task
//

function watch() {
  browserSync.init({
    open: 'external',
    proxy: 'http://localhost/' + themename,
    port: 8080
  });
  init();
  gulp.watch(cssWatch, gulp.series([scss, css]));
  gulp.watch(jsWatch, gulp.series([javascript]));
  gulp.watch(imgWatch, gulp.series([images]));
  gulp.watch([jsDist + themename + '.min.js', cssDist + 'style.min.css', src + '*.html'])
    .on('change', browserSync.reload);
}

// Exports 
//

exports.scss = scss;
exports.css = css;
exports.javascript = javascript;
exports.watch = watch;
exports.imagemin = imagemin;
exports.html = html;

// Gulp default
//

let build = gulp.parallel(watch);
gulp.task('default', build);