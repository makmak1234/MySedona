var gulp = require('gulp');  
var browserify = require('gulp-browserify');  
var concat = require('gulp-concat');  
var styl = require('gulp-styl');  
var refresh = require('gulp-livereload'); 
var concatCss = require('gulp-concat-css'); 
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-ruby-sass');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
//var uglify = require('gulp-uglify');
var lr = require('tiny-lr');  
var server = lr();

gulp.task('scripts', function() {  
    gulp.src(['src/js/*.js'])
        .pipe(browserify())
        .pipe(concat('dest.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(refresh(server))
})

gulp.task('sass', function () {
  return sass('src/sass')
    .on('error', sass.logError)
    .pipe(gulp.dest('src/css'));
});

gulp.task('styles', function() {  
    gulp.src(['src/css/*.css'])
    //gulp.src(['css/reset.css', 'css/index.css'])
        .pipe(concatCss('index.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(styl({compress : true}))
        .pipe(gulp.dest('build/css'))
        .pipe(refresh(server))
}) 

/*gulp.task('imagemin', function () {
    return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('src/imgmin/'));
});*/

gulp.task('imagemin', function () {
        gulp.src('src/img/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('build/img/'));

        gulp.src('src/img/sprites/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('src/img/sprites_min/'));
});

/*gulp.task('sprite', function () {
  var spriteData = gulp.src('img/sprites/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'css/sprite.css'
  }));
  return spriteData.pipe(gulp.dest('path/to/output/'));
});*/

gulp.task('sprite', function () {
  gulp.src('src/img/sprites_min/*.png')
    .pipe(spritesmith({
        imgName: 'spritesheet.png',
        imgPath: '../img/spritesheet.png',
        cssName: '../../src/css/sprites.css',
        algorithm: 'top-down',
        padding: 1
  }))
  .pipe(gulp.dest('build/img/'));
});


gulp.task('lr-server', function() {  
    server.listen(35729, function(err) {
        if(err) return console.log(err);
    });
})

gulp.task('default', function() {  
    gulp.run('lr-server', 'scripts', 'styles', 'sass');

    gulp.watch('src/js/**', function(event) {
        gulp.run('scripts');
    })

    gulp.watch('src/sass/**', function(event) {
        gulp.run('sass');
    })

    gulp.watch('src/css/**', function(event) {
        gulp.run('styles');
    })

    /*gulp.watch('build/img_orig/*.*', function(event) {
        gulp.run('imagemin');
    })*/
})