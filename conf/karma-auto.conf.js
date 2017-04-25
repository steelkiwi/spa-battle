import conf from './gulp.conf';
import listFiles from './karma-files.conf';

module.exports = config => {
    const configuration = {
        basePath: '../',
        singleRun: false,
        autoWatch: false,
        logLevel: 'INFO',
        junitReporter: {
            outputDir: 'test-reports'
        },
        browsers: [
            'PhantomJS'
        ],
        frameworks: [
            'phantomjs-shim',
            'jasmine'
        ],
        files: listFiles(),
        preprocessors: {
            [conf.path.src('**/*.html')]: [
              'ng-html2js'
            ]
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: `${conf.paths.src}/`,
            moduleName: 'app'
        },
        plugins: [
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-phantomjs-shim',
            'karma-ng-html2js-preprocessor'
        ]
    };

    config.set(configuration);
};
