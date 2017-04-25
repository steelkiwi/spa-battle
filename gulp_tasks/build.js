import gulp from 'gulp';
import filter from 'gulp-filter';
import useref from 'gulp-useref';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import uglify from 'gulp-uglify';
import cssnano from 'gulp-cssnano';
import htmlmin from 'gulp-htmlmin';
import sourcemaps from 'gulp-sourcemaps';
import uglifySaveLicense from 'uglify-save-license';
import inject from 'gulp-inject';
import ngAnnotate from 'gulp-ng-annotate';

import conf from '../conf/gulp.conf';

gulp.task('build', build);

function build() {
    const partialsInjectFile = gulp.src(conf.path.tmp('templateCacheHtml.js'), {
        read: false
    });
    const partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: conf.paths.tmp,
        addRootSlash: false
    };

    const htmlFilter = filter(conf.path.tmp('*.html'), {
        restore: true
    });
    const jsFilter = filter(conf.path.tmp('**/*.js'), {
        restore: true
    });
    const cssFilter = filter(conf.path.tmp('**/*.css'), {
        restore: true
    });

    return gulp.src(conf.path.tmp('/index.html'))
        .pipe(inject(partialsInjectFile, partialsInjectOptions))
        .pipe(useref())
        .pipe(jsFilter)
        // .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(uglify({
            preserveComments: uglifySaveLicense
        }))
        .on('error', conf.errorHandler('Uglify'))
        .pipe(rev())
        // .pipe(sourcemaps.write('maps'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(cssnano())
        // .pipe(sourcemaps.init())
        .pipe(rev())
        // .pipe(sourcemaps.write('maps'))
        .pipe(cssFilter.restore)
        .pipe(revReplace())
        .pipe(htmlFilter)
        .pipe(htmlmin())
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(conf.path.dist()));
}
