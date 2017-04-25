import gulp from 'gulp';
import HubRegistry from 'gulp-hub';
import browserSync from 'browser-sync';

import conf from './conf/gulp.conf';

// Load some files into the registry
const hub = new HubRegistry([conf.path.tasks('*.js')]);

// Tell gulp to use the tasks just loaded
gulp.registry(hub);

gulp.task('create', gulp.series('sprites', gulp.parallel('styles', 'scripts', 'webpack'), 'inject', 'favicons'));
gulp.task('build', gulp.series('partials', gulp.parallel('create', 'other'), 'build'));
gulp.task('test', gulp.series('scripts', 'karma:single-run'));
gulp.task('test:auto', gulp.series('watch', 'karma:auto-run'));
gulp.task('serve', gulp.series('create', 'watch', 'browsersync'));
gulp.task('serve:dist', gulp.series('default', 'browsersync:dist'));
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('watch', watch);

function reloadBrowserSync(cb) {
    browserSync.reload();
    cb();
}

function watch(done) {
    gulp.watch([
        conf.path.src('index.html')
    ], gulp.parallel('inject'));

    gulp.watch(conf.path.src('**/*.html'), reloadBrowserSync);
    gulp.watch([
        conf.path.src('**/*.less'),
        conf.path.src('**/*.css')
    ], gulp.series('styles'));
    gulp.watch(conf.path.src('**/*.js'), gulp.series('scripts', 'inject'));
    done();
}
