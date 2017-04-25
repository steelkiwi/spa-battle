import gulp from 'gulp';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import lesshint from 'gulp-lesshint';
import del from 'del';

import conf from '../conf/gulp.conf';

gulp.task('styles', styles);

function styles() {
    return gulp.src(conf.path.src('index.less'))
        .pipe(sourcemaps.init())
        .pipe(lesshint({
            configPath: conf.path.src('.lesshintrc')
        }))
        .pipe(less({
            compress: false
        })).on('error', conf.errorHandler('Less'))
        .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(conf.path.tmp()))
        .pipe(browserSync.stream());
}
