import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import angularTemplatecache from 'gulp-angular-templatecache';

import conf from '../conf/gulp.conf';

gulp.task('partials', partials);

function partials() {
    return gulp.src(conf.path.src('**/*.html'))
        .pipe(htmlmin())
        .pipe(angularTemplatecache('templateCacheHtml.js', {
            module: conf.ngModule,
            root: ''
        }))
        .pipe(gulp.dest(conf.path.tmp()));
}
