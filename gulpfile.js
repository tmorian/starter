// Dependencies
var gulp 		 = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass         = require('gulp-sass');
var runSequence  = require('gulp-run-sequence');
var fileinclude  = require('gulp-file-include');
var minify 		 = require('gulp-minify');
var concat       = require('gulp-concat');
var browserSync  = require('browser-sync');
var clean        = require('gulp-clean');
var reload 		 = browserSync.reload;

//Config
var url = 'http://DEV-URL-HERE.COM';

var source = {};
	source.path = 'assets'
	source.styles = '/styles/**/*.scss';
	source.portfolio = '/portfolio/**/*.scss';
	source.scripts = '/scripts/*.js';
	source.lib = '/lib/**/*';
	source.images = '/images/**/*';
	source.meta = 'meta/**/*';
	source.fonts = '/fonts/**/*';
	source.pages = 'pages/**/*';
	source.pagePartials = 'partials/';
	source.app = 'app/**/*.php';

var destination = {};
	destination.styles = 'dist/styles';
	destination.scripts = 'dist/scripts';
	destination.lib = 'dist/lib';
	destination.images = 'dist/images';
	destination.meta = 'dist';
	destination.fonts = 'dist/fonts';
	destination.pages = 'dist';
	destination.app = 'dist/app';

//Tasks
gulp.task('default', function() {
	runSequence(
		'clean',
		'lib',
		'styles',
		'scripts',
		'images',
		'fonts',
		'pages');
});

gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

//moves html files to dist
gulp.task('pages', function(){
	return gulp.src(source.pages,
		{
	        dot: true
	    })
		.pipe(fileinclude({
			prefix: '@@',
			basepath: source.pagePartials
		}))
		.pipe(gulp.dest(destination.pages))
		.pipe(reload({ stream:true }));
});

//moves app files to dist
gulp.task('app', function(){
	return gulp.src(source.app)
		.pipe(gulp.dest(destination.app))
		.pipe(reload({ stream:true }));
});

//prepares styles
gulp.task('styles', function(){
	return gulp.src(source.path + source.styles)
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 1%'],
			cascade: false
		}))
		.pipe(gulp.dest(destination.styles))
		.pipe(reload({ stream:true }));
});

//portfolio styles
gulp.task('portfolio', function(){
	return gulp.src(source.path + source.portfolio)
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 1%'],
			cascade: false
		}))
		.pipe(gulp.dest(destination.styles))
		.pipe(reload({ stream:true }));
});

//concats and minifys scripts
gulp.task('scripts', function(){
	return gulp.src(source.path + source.scripts)
		.pipe(concat('main.js'))
		.pipe(minify({
			ext:{
				src:'-debug.js',
				min:'.js'
			}
		}))
		.pipe(gulp.dest(destination.scripts))
		.pipe(reload({ stream:true }));
});

//moves lib files to dist
gulp.task('lib', function(){
	return gulp.src(source.path + source.lib)
		.pipe(gulp.dest(destination.lib))
		.pipe(reload({ stream:true }));
});

//moves meta files to dist
gulp.task('meta', function(){
	return gulp.src(source.meta)
		.pipe(gulp.dest(destination.meta))
		.pipe(reload({ stream:true }));
});

//moves image files to dist
gulp.task('images', function(){
	return gulp.src(source.path + source.images)
		.pipe(gulp.dest(destination.images))
		.pipe(reload({ stream:true }));
});

//moves font files to dist
gulp.task('fonts', function(){
	return gulp.src(source.path + source.fonts)
		.pipe(gulp.dest(destination.fonts))
		.pipe(reload({ stream:true }));
});

//watches files and reloads page
gulp.task('serve', function(){
	browserSync({
		proxy: url
	});
	gulp.watch([source.path + source.scripts], ['scripts']);
	gulp.watch([source.path + source.lib], ['lib']);
	gulp.watch([source.path + source.styles], ['styles']);
	gulp.watch([source.path + source.portfolio], ['portfolio']);
	gulp.watch([source.path + source.images], ['images']);
	gulp.watch([source.path + source.meta], ['meta']);
	gulp.watch([source.path + source.fonts], ['fonts']);
	gulp.watch([source.pagePartials + '/**/*.php'], ['pages']);
	gulp.watch([source.pages], ['pages']);
	gulp.watch([source.app], ['app']);
});

//primary task, runs tasks in sequece
gulp.task('watch', function(){
	runSequence(
		'clean',
		'lib',
		'styles',
		'portfolio',
		'scripts',
		'app',
		'images',
		'meta',
		'fonts',
		'pages',
		'serve');
});




