import conf from './gulp.conf';

module.exports = function listFiles() {
    const patterns = [
        'node_modules/babel-polyfill/browser.js',
        conf.path.tmp('modules.js'),
        conf.path.tmp('index.js'),
        conf.path.tmp('configs/**/*.js'),
        conf.path.tmp('constants/**/*.js'),
        conf.path.tmp('containers/**/*.js'),
        conf.path.tmp('components/**/*.js'),
        conf.path.tmp('pages/**/*.js'),
        conf.path.tmp('*.js'),
        conf.path.src('**/*.html')
    ];

    const files = patterns.map(pattern => ({pattern}));
    files.push({
        pattern: conf.path.src('assets/**/*'),
        included: false,
        served: true,
        watched: false
    });
    return files;
};
