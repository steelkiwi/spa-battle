import gulp from 'gulp';
import gulpWebpack from 'webpack';
import gulplog from 'gulplog';
import UglifyJsPlugin from 'webpack/lib/optimize/UglifyJsPlugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import pjson from '../package.json';

import conf from '../conf/gulp.conf';

gulp.task('webpack', webpack);

function getDep(){
    const dep = [];

    dep.push('./angular/angular.js');
    dep.push('./angular-cookies/angular-cookies.js');
    dep.push('./angular-animate/angular-animate.js');
    dep.push('./angular-aria/angular-aria.js');
    dep.push('./angular-messages/angular-messages.js');
    dep.push('./angular-material/angular-material.js');
    dep.push('./angular-mocks/angular-mocks.js');
    dep.push('./angular-ui-router/release/angular-ui-router.js');

    return dep;
}

function webpack(callback) {
    gulp.src(conf.path.src('index.html'))
        .pipe(gulp.dest(conf.path.tmp()));
    const options = {
        context: conf.paths.modules,
        entry: getDep(),
        watch: false,
        output: {
            filename: 'modules.js',
            path: './.tmp'
        }
    };

    return gulpWebpack(options, function(err, stat) {
        if (!err) {
            err = stat.toJson().errors[0];
        }

        if (err) {
            gulplog.error(err);
        } else {
            gulplog.info(stat.toString({
                colors: true
            }));
        }

        if (err) {
            callback(err);
        } else {
            callback();
        }
    })
}
