//  Init path vars
//======================================================================
var basePaths = {
       src: 'src/',
       dist: 'dist/'
    },
    spriteName = 'sprite.png',
    paths = {
    	images: {
    		src: basePaths.src + 'images/',
    		sprite: basePaths.src + 'images/sprite/',
            dist: basePaths.dist + 'images/'
    	}, 
        assets: {
            src: basePaths.src + 'assets/',
            dist: basePaths.dist + 'assets/'
        },	
    	fonts: {
    		src: basePaths.src + 'fonts/',
    		dist: basePaths.dist + 'fonts/'
    	},
    	html: {
    		src: basePaths.src + 'jade/',
    		dist: basePaths.dist
    	},
    	css: {
    		src: basePaths.src + 'sass/',
    		dist: basePaths.dist + 'css/'
    	},
    	js: {
    		src: basePaths.src + 'coffee/',
    		dist: basePaths.dist + 'js/'
    	}
    };

    var bowerVars = {
        folder: basePaths.src + 'vendors/',
        outputJs: 'libs.js',
        outputCss: 'libs.css'
    };

//======================================================================



// Init gulp vars
var gulp = require('gulp'),
    gulpsync = require('gulp-sync')(gulp),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    pleeease = require('gulp-pleeease'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    imagemin = require('gulp-imagemin'),
    watch = require('gulp-watch'),
    spritesmith = require('gulp.spritesmith'),
    coffee = require('gulp-coffee'),
    gulpif = require('gulp-if'),
    gulpFilter = require('gulp-filter'),
    fs = require('fs'),
    bowerFiles = require('main-bower-files'),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    rimraf = require('gulp-rimraf'),
    data = require('gulp-data'),
    database    = require('./src/data/data.json'),
    reload = browserSync.reload;
//======================================================================



 

 
// Compile css from sass
//======================================================================
gulp.task('sass', function () {
    gulp.src(paths.css.src + '**/*.scss')
    	// .pipe(sourcemaps.init())
        .pipe(sass({
        	errLogToConsole: true
        }))   
        .pipe(pleeease({
            minifier: true
        }))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css.dist));
});


// jade to html
//======================================================================
gulp.task('jade', function () {
    gulp.src(paths.html.src + '*.jade')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(jade({
            'pretty': true,
            'locals': database
        }))
        .pipe(gulp.dest(paths.html.dist));
});
//======================================================================




// Clean tasks
//======================================================================
gulp.task('cleanBuild', function(){
  return gulp.src(basePaths.dist)
    .pipe(rimraf({ force: true }));
});



gulp.task('cleanImages', function(){
  return gulp.src(paths.images.dist + '**/*.*', { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('cleanAssets', function(){
  return gulp.src(paths.assets.dist + '**/*.*', { read: false })
    .pipe(rimraf({ force: true }));
});


gulp.task('cleanFonts', function(){
  return gulp.src('dist/fonts/**/*.*', { read: false })
    .pipe(rimraf({ force: true }));
});

gulp.task('cleanData', function(){
  return gulp.src('dist/data/', { read: false })
    .pipe(rimraf({ force: true }));
});

//======================================================================



// Tasks for images and fonts and data files
//======================================================================

gulp.task('sprite', function () {
    var spriteData = gulp.src(paths.images.sprite + '*.png')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        })) 
        .pipe(spritesmith({
            cssFormat: 'scss',
            imgName: spriteName,
            imgPath: '../images/' + spriteName,
            cssName: '_sprite.scss'
        }));
    spriteData.img.pipe(gulp.dest(paths.images.dist)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(paths.css.src)); // путь, куда сохраняем стили
});



gulp.task('moveImages', ['cleanImages', 'sprite'], function () {
    gulp.src(paths.images.src + '/**/*.*')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))    
        .pipe(watch(paths.images.src + '*.*'))
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dist));
});



gulp.task('moveAssets', ['cleanAssets'], function () {
    gulp.src(paths.assets.src + '**/*.*')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))    
        .pipe(watch(paths.assets.src + '*.*'))
        .pipe(imagemin())
        .pipe(gulp.dest(paths.assets.dist));
});



gulp.task('moveFonts', ['cleanFonts'], function () {
    gulp.src(paths.fonts.src + '**/*.*')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))    
        .pipe(watch(paths.fonts.src + '**/*.*'))
        .pipe(gulp.dest(paths.fonts.dist));
});


gulp.task('moveJsLibs', ['coffee'], function () {
    gulp.src('src/jslibs/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))    
        .pipe(watch('src/jslibs/*.*'))
        .pipe(gulp.dest('dist/js/'));
});

//========================================================================




// Coffescript to *.js
//======================================================================
gulp.task('coffee', function() {
  gulp.src(paths.js.src + '*.coffee')
    .pipe(plumber({
        errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init())   
    .pipe(coffee({
        bare: true
    }))
    .pipe(sourcemaps.write())
    .on('error', function(err) {
        console.log(err);
    })      
    .pipe(gulp.dest(paths.js.dist));
});





// Static server
//======================================================================
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: basePaths.dist,
            logLevel: "info"
        }
    });
});
//======================================================================


// Reload all browsers
//======================================================================
gulp.task('bs-reload', function () {
    browserSync.reload();
});
//======================================================================


 

gulp.task('loadBower', function() {
    bower();
});




// bower
gulp.task('prepareBowerComponents', ['loadBower'],function() {
    
    var jsFilter = gulpFilter('**/**/*.js', {restore: true});
    var cssFilter = gulpFilter('**/**/*.css', {restore: true});
    var scssFilter = gulpFilter('**/**/*.scss', {restore: true});

    

    if (fs.existsSync(bowerVars.folder)) { 
        return  gulp.src(bowerFiles())
                    .pipe(plumber({
                        errorHandler: function (error) {
                            console.log(error.message);
                            this.emit('end');
                        }
                    }))        
                    .pipe(jsFilter)
                    .pipe(concat(bowerVars.outputJs))
                    .on('error', function(err) {
                        console.log(err);
                    })                    
                    .pipe(gulp.dest(paths.js.dist+ 'libs/'))
                    .pipe(jsFilter.restore)    
                    .pipe(cssFilter)
                    .pipe(concat(bowerVars.outputCss))
                    .pipe(pleeease({
                        minifier: false
                    }))                    
                    .on('error', function(err) {
                        console.log(err);
                    })                      
                    .pipe(gulp.dest(paths.css.dist + 'libs/'))
                    .pipe(cssFilter.restore)                    
                    .pipe(scssFilter)                    
                    .on('error', function(err) {
                        console.log(err);
                    })                      
                    .pipe(gulp.dest(paths.css.src + 'libs/'))
                    .pipe(scssFilter.restore);

    } 

});




gulp.task('build', gulpsync.sync(['cleanBuild', 'jade', 'sprite', 'sass', 'coffee', 'moveJsLibs', 'moveImages', 'moveAssets',  'moveFonts', 'prepareBowerComponents']));
 
gulp.task('default', gulpsync.sync(['build', 'browser-sync']), function(){
    gulp.watch(paths.css.src + '**/*.scss', ['sass']);
    gulp.watch(paths.html.src + '**/*.jade', ['jade']);
    gulp.watch(paths.images.sprite + '*.*',['sprite']);
    gulp.watch(paths.images.src + '*.*',['moveImages']);
    gulp.watch(paths.assets.src + '**/*.*',['moveAssets']);
    gulp.watch(paths.fonts.src + '*.*',['moveFonts']);
    gulp.watch('./src/jslibs/*.js',['moveJsLibs']);
    gulp.watch(paths.js.src + '*.coffee',['coffee']);
    gulp.watch(['./bower.json', './.bower.json'], ['prepareBowerComponents']);
    gulp.watch([basePaths.dist + "*.html"], ['bs-reload']);
});
