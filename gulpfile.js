const gulp = require('gulp'),
	uglify = require('gulp-uglify-es').default;
// javascriptObfuscator = require('gulp-javascript-obfuscator');


gulp.task('uglify', () => {
	return gulp.src('src/**/artist.js')
		.pipe(uglify())
		// .pipe(javascriptObfuscator({
		// 	compact: true,
		// 	renameGlobals: true,
		// 	unicodeEscapeSequence: true,
		// 	splitStrings: true,
		// 	selfDefending: true,
		// 	controlFlowFlattening: true,
		// }))
		.pipe(gulp.dest('./'));
});


gulp.task('default', gulp.series(['uglify'])); 