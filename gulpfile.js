var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    babel = require('babelify');


gulp.task('js', function() {
		$.util.log('Compiling javascript files');
    return browserify({
            entries: './src/http.js',
            debug: true
        })
        .transform(babel.configure({
            presets: ['es2015']
        }))
        .bundle()
        .on('error', function(err) {
            $.util.log(err);
        })
        .pipe(source('http.js'))
        .pipe(buffer())
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('clean', function() {
	$.util.log('Cleaning build');
	del('./dist');
});


gulp.task('build', ['clean', 'js']);
