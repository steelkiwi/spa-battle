import gulp from 'gulp';
import gulpWebpack from 'webpack';
import gulplog from 'gulplog';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import conf from'../conf/gulp.conf';

gulp.task('favicons', faviconTask);

function faviconTask(callback) {
    const options = {
        context: conf.paths.src,
        plugins: [
            new FaviconsWebpackPlugin({
                logo: './images/favicon.png',
                prefix: '.tmp/icons/',
                emitStats: false,
                statsFilename: 'iconstats-[hash].json',
                persistentCache: true,
                inject: true,
                background: '#fff',
                title: 'AngularJS',
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: true,
                    coast: false,
                    favicons: true,
                    firefox: true,
                    opengraph: false,
                    twitter: true,
                    yandex: true,
                    windows: true
                }
            }),
            new HtmlWebpackPlugin({
              filename: './.tmp/index.html',
              template: '../.tmp/index.html'
            })

        ]
    };

    return gulpWebpack(options, (err, stat) => {
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
