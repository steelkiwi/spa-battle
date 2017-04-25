import $urlRouterProvider from 'angular-router';
import $locationProvider from 'angular';
import app from 'index';

const config = ($urlRouterProvider, $locationProvider) => {
    $locationProvider.html5Mode(false).hashPrefix('');
    $urlRouterProvider.otherwise('/');
};

export default app.config([
    '$urlRouterProvider', '$locationProvider', config
]);
