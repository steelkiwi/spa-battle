import path from 'path';

import gulp from 'gulp';
import del from 'del';
import filter from 'gulp-filter';

import conf from '../conf/gulp.conf';

gulp.task('clean', clean);
gulp.task('other', other);

function clean() {
    return del([conf.paths.dist, conf.paths.tmp]);
}

function other() {
    const fileFilter = filter(file => file.stat.isFile());

    return gulp.src([
            path.join(conf.paths.src, '/**/*'),
            path.join(`!${conf.paths.src}`, '/**/*.{less,js,html}')
        ])
        .pipe(fileFilter)
        .pipe(gulp.dest(conf.paths.dist));
}
