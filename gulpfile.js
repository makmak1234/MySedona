var gulp = require('gulp');  
var browserify = require('gulp-browserify');  
var concat = require('gulp-concat');  
var styl = require('gulp-styl');  
var refresh = require('gulp-livereload'); 
var concatCss = require('gulp-concat-css'); 
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-ruby-sass');
//var uglify = require('gulp-uglify');
var lr = require('tiny-lr');  
var server = lr();

gulp.task('scripts', function() {  
    gulp.src(['src/**/*.js'])
        .pipe(browserify())
        .pipe(concat('dest.js'))
        .pipe(gulp.dest('build'))
        .pipe(refresh(server))
})

gulp.task('sass', function () {
  return sass('css/sass')
    .on('error', sass.logError)
    .pipe(gulp.dest('css'));
});

gulp.task('styles', function() {  
    //gulp.src(['css/**/*.css'])
    gulp.src(['css/reset.css', 'css/index.css'])
        .pipe(concatCss('build.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(styl({compress : true}))
        .pipe(gulp.dest('build'))
        .pipe(refresh(server))
})

gulp.task('lr-server', function() {  
    server.listen(35729, function(err) {
        if(err) return console.log(err);
    });
})

gulp.task('default', function() {  
    gulp.run('lr-server', 'scripts', 'styles', 'sass');

    gulp.watch('src/**', function(event) {
        gulp.run('scripts');
    })

    gulp.watch('css/sass/**', function(event) {
        gulp.run('sass');
    })

     gulp.watch('css/**', function(event) {
        gulp.run('styles');
    })
})