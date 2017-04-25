import $stateProvider from 'angular';
import favoritesPage from 'favorites';
import app from 'index';

export default app.config(['$stateProvider', $stateProvider => {
    $stateProvider.state('favorites', {
        url: '/favorites',
        resolve: {
            currentAuth: ['FirebaseAuthFactory', FirebaseAuthFactory => {
                return FirebaseAuthFactory.$requireSignIn();
            }],
            characters: ['charactersService', 'currentAuth', (charactersService, currentAuth) => {
                return charactersService.getAllFavorite(currentAuth);
            }]
        },
        component: 'favoritesPage'
    });
}]);
