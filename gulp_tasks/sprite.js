import gulp from 'gulp';
import gulpWebpack from 'webpack';
import gulplog from 'gulplog';
import Spritesmith from 'webpack-spritesmith';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import conf from '../conf/gulp.conf';

gulp.task('sprites', sprites);

function sprites(callback) {
    const options = {
        context: conf.paths.src,
        module: {
            loaders: [{
                    test: /\.styl$/,
                        loaders: [
                            'style-loader',
                            'css-loader',
                            'stylus-loader'
                        ]
                }, {
                    test: /\.png$/,
                    loaders: [
                        'file-loader?name=i/[hash].[ext]'
                    ]
                }
            ]
        },
        resolve: {
            modulesDirectories: ["node_modules", "spritesmith-generated"],
            modules: ["node_modules", "spritesmith-generated"]
        },
        plugins: [
            new Spritesmith({
                src: {
                    cwd: './src/images/sprites',
                    glob: '*.png'
                },
                target: {
                    image: '.tmp/sprites.png',
                    css: 'src/styles/base/sprites.less'
                },
                apiOptions: {
                    cssImageRef: "~sprite.png"
                }
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
