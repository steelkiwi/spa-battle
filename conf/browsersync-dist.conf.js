import conf from './gulp.conf';

module.exports = () => {
    return {
        server: {
            baseDir: [
                conf.paths.dist
            ]
        },
        open: false
    };
};
