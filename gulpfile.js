const gulp          = require('gulp');
const less          = require('gulp-less');
const pug           = require('gulp-pug');
const autoprefixer  = require('autoprefixer');
const postcss       = require('gulp-postcss');
const rename        = require('gulp-rename');
const imagemin      = require('gulp-imagemin');
const pngquant      = require('imagemin-pngquant');
const browserSync   = require('browser-sync');
const jshint        = require('gulp-jshint');
const uglify        = require('gulp-uglify');
const concat        = require('gulp-concat');
const path          = require('path');
const plumber       = require('gulp-plumber');

const postPlugins   = [autoprefixer];
const reload        = browserSync.reload;

gulp.task('serve', function () {
    gulp.watch(['./src/styles/index.less', './src/**/*.less'], ['styles']);
    gulp.watch('./src/**/*.pug', ['pug']);
    gulp.watch('./src/**/*.js', ['scripts'])
});


gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "./dist"
        },
        port: 3000,
        open: true,
        notify: false
    });
});

gulp.task('scripts', function() {
    return gulp.src('src/js/main.js')
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream:true}));
});

gulp.task('scripts:libs', function() {
    return gulp.src(['src/js/libs/dependencies/**.*js', 'src/js/libs/*.js'])
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream:true}));
});

gulp.task('styles', function () {
    return gulp
        .src('./src/styles/index.less')
        .pipe(plumber())
        .pipe(less({
            'include css': true
        }))
        .pipe(postcss(postPlugins))
        .pipe(rename('bundle.css'))
        .pipe(gulp.dest('./dist/css/'))

});

gulp.task('pug', function () {
    return gulp
        .src('./src/index.pug')
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest('./dist'))
        .pipe(reload({stream:true}));
});

gulp.task('fonts', function () {
    return gulp
        .src('./src/fonts/**/*.*')
        .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('images', function () {
    return gulp.src('./src/img/**/*.{png,jpg,gif,svg}')
        .pipe(imagemin({use: [pngquant()]}))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('default', ['pug', 'styles', 'scripts:libs', 'scripts','fonts', 'images', 'serve', 'browserSync']);