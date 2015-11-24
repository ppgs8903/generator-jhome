/**
 * Created by Administrator on 2015/11/23.
 *
 *
  	gulp.task(name, fn)这个你应经见过了
 	gulp.run(tasks...)尽可能多的并行运行多个task
 	gulp.watch(glob, fn)当glob内容发生改变时，执行fn
 	gulp.src(glob)返回一个可读的stream
 	gulp.dest(glob)返回一个可写的stream
 */
// 载入外挂
var gulp = require('gulp'),
	//sass = require('gulp-ruby-sass'),
	//sass = require('node-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css');
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	//notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload');
	// 配合打包生产和开发环境
	gulpif = require('gulp-if')
    minimist = require('minimist');

//development & production
var options = 'development';

// 样式
/*
 autoprefixer:
 //last 2 versions: 主流浏览器的最新两个版本
 //last 1 Chrome versions: 谷歌浏览器的最新版本
 //last 2 Explorer versions: IE的最新两个版本
 //last 3 Safari versions: 苹果浏览器最新三个版本
 //Firefox >= 20: 火狐浏览器的版本大于或等于20
 //iOS 7: IOS7版本
 //Firefox ESR: 最新ESR版本的火狐
 //> 5%: 全球统计有超过5%的使用率

 browsers:
 //是否美化属性值 默认：true 像这样：
 //-webkit-transform: rotate(45deg);
 //        transform: rotate(45deg);
*/
gulp.task('styles', function() {
	return gulp.src('src/styles/*.css')      //压缩的文件
		.pipe(gulpif(options === 'production', rename({suffix: '.min'})))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true,
			remove:true //是否去掉不必要的前缀 默认：true
		}))
		.pipe(gulpif(options === 'production',minifycss()))   //执行压缩
		.pipe(gulp.dest('dist/styles/'));   //输出文件夹
});

// 脚本
gulp.task('scripts', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulpif(options === 'production',rename({ suffix: '.min' })))
		.pipe(gulpif(options === 'production',uglify()))
		.pipe(gulp.dest('dist/scripts'))
});

// 图片
gulp.task('images', function() {
	return gulp.src('src/img/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/img'));
});

// 清理
gulp.task('clean', function() {
	return gulp.src(['dist/*'], {read: false})
		.pipe(clean());
});

// 预设任务
gulp.task('default', ['clean'], function() {
	gulp.start('styles', 'scripts', 'images');
});

// 看手
gulp.task('watch', function() {

	// 看守所有.scss档
	gulp.watch('src/styles/**/*.scss', ['styles']);

	// 看守所有.js档
	gulp.watch('src/scripts/**/*.js', ['scripts']);

	// 看守所有图片档
	gulp.watch('src/images/**/*', ['images']);

	// 建立即时重整伺服器
	var server = livereload();

	// 看守所有位在 dist/  目录下的档案，一旦有更动，便进行重整
	gulp.watch(['dist/**']).on('change', function(file) {
		server.changed(file.path);
	});

});