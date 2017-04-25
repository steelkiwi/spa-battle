import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpInject from 'gulp-inject';

import conf from '../conf/gulp.conf';

gulp.task('inject', inject);

function inject() {
    const injectScripts = gulp.src([
        conf.path.tmp('**/*.js'),
        `!${conf.path.tmp('templateCacheHtml.js')}`,
        `!${conf.path.tmp('**/*.spec.js')}`,
        `!${conf.path.tmp('**/modules.js')}`
    ]);

    const injectOptions = {
        ignorePath: [conf.paths.src, conf.paths.tmp],
        addRootSlash: false
    };

    const modulesInjectFile = gulp.src(conf.path.tmp('modules.js'), {
        read: false
    });

    const modulesInjectOptions = {
        starttag: '<!-- inject:modules -->',
        ignorePath: conf.paths.tmp,
        addRootSlash: false
    };

    return gulp.src(conf.path.tmp('index.html'))
        .pipe(gulpInject(modulesInjectFile, modulesInjectOptions))
        .pipe(gulpInject(injectScripts, injectOptions))
        .pipe(gulp.dest(conf.paths.tmp))
        .pipe(browserSync.stream());
}
