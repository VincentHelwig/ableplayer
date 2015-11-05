/**
 * Created by jean on 12/06/15.
 */

var gulp = require('gulp');
var iconfont = require('gulp-iconfont');

gulp.task('svgfont', function(){
  return gulp.src(['images/*.svg'])
    .pipe(iconfont({
      fontName: 'able', // required
      appendUnicode: true, // recommended option
      normalize: true,
      fontHeight: 1001,
      formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
      timestamp: Math.round(Date.now()/1000)
    }))
    .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g.
        for (var g = 0; g < glyphs.length; g++) {
            console.log( glyphs[g].unicode[0].charCodeAt(0).toString(16).toUpperCase());
        }
    })
    .pipe(gulp.dest('../fonts/'));
});
