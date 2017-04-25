import conf from './gulp.conf';

module.exports = () => {
    return {
        server: {
            baseDir: [
                conf.paths.tmp,
                conf.paths.src
            ]
        },
        open: false
    };
};
