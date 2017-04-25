import $stateProvider from 'angular';
import app from 'index';

export default app.config(['$stateProvider', $stateProvider => {
    $stateProvider.state('home', {
        url: '/',
        resolve: {
            currentAuth: ['FirebaseAuthFactory', FirebaseAuthFactory => {
                return FirebaseAuthFactory.$waitForSignIn();
            }],
            characters: ['charactersService', 'currentAuth', (charactersService, currentAuth) => {
                return charactersService.get(currentAuth);
            }]
        },
        component: 'homePage'
    });
}]);
