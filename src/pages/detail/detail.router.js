import $stateProvider from 'angular';
import app from 'index';

export default app.config(['$stateProvider', $stateProvider => {
    $stateProvider.state('detail', {
        url: '/detail/:id',
        resolve: {
            currentAuth: ['FirebaseAuthFactory', FirebaseAuthFactory => {
                return FirebaseAuthFactory.$waitForSignIn();
            }],
            character: ['currentAuth', '$stateParams', 'charactersService', (currentAuth, $stateParams, charactersService) => {
                return charactersService.getById(currentAuth, $stateParams.id);
            }],
            chatMessages: ['chatService', 'character', 'usersService', 'dateService', (chatService, character, usersService, dateService) => {
                return chatService.getMessages(character)
                    .then(response => usersService.fetchAuthor(response))
                    .then(response => dateService.fetchDate(response));
            }]
        },
        component: 'detailPage'
    });
}]);
