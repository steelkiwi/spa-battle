import gulp from 'gulp';
import browserSync from 'browser-sync';
import spa from 'browser-sync-spa';

import browserSyncConf from '../conf/browsersync.conf';
import browserSyncDistConf from '../conf/browsersync-dist.conf';

browserSync.use(spa());

gulp.task('browsersync', browserSyncServe);
gulp.task('browsersync:dist', browserSyncDist);

function browserSyncServe(done) {
    browserSync.init(browserSyncConf());
    done();
}

function browserSyncDist(done) {
    browserSync.init(browserSyncDistConf());
    done();
}
