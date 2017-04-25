import app from 'index';
import chatService from '../../services/chat.service';
import charactersService from '../../services/characters.service';
import spinnersService from '../../services/spinners.service';

export class HomePage {
    static get $inject() {
        return [
            'charactersService',
            'spinnersService',
            '$rootScope',
            '$firebaseObject',
            '$scope'
        ];
    }

    constructor(charactersService, spinnersService, $rootScope, $firebaseObject, $scope) {
        this.charactersService = charactersService;
        this.spinnersService = spinnersService;
        this.$rootScope = $rootScope;
        this.$firebaseObject = $firebaseObject;
        this.$scope = $scope;

        this.$rootScope.$on('login', (state, message) => {
            this.currentAuth = message.message.user;
            this.spinnersService.setBusy(true);
            this.charactersService.fetchFavorite(this.currentAuth, this.characters)
                .then(response => this.charactersService.fetchRating(this.currentAuth, this.characters))
                .then(response => {
                    this.characters = response;
                    this.spinnersService.setBusy(false);
                });
        });

        this.$rootScope.$on('logout', () => {
            this.characters.forEach(item => {
                delete item.isFavorite;
                delete item.rating;
                this.currentAuth = null;
            });
        });

        this.$rootScope.$on('search', (state, data) => {
            this.characters = data.message;
            this.hideLoadMoreButton = true;
            this.spinnersService.setBusy(false);
        });
        this.$rootScope.$on('cancel_search', (state, data) => {
            this.hideLoadMoreButton = false;
        });
    }

    $onInit() {
        if (this.currentAuth) {
            this.$firebaseObject(firebase.database().ref()
                .child('heroRating')
                .child(this.currentAuth.uid)
            ).$watch(data => {
                this.charactersService.fetchFavorite(this.currentAuth, this.characters)
                    .then(response => this.charactersService.fetchRating(this.currentAuth, response))
                    .then(response => {
                        this.characters = response;
                    });
            });

            this.$firebaseObject(firebase.database().ref()
                .child('favorites')
                .child(this.currentAuth.uid)
            ).$watch(data => {
                this.charactersService.fetchFavorite(this.currentAuth, this.characters)
                    .then(response => this.charactersService.fetchRating(this.currentAuth, response))
                    .then(response => {
                        this.characters = response;
                    });
            });
        }
    }

    loadMore() {
        this.spinnersService.setBusy(true);
        this.charactersService.get(this.currentAuth)
            .then(response => {
                this.characters = this.characters.concat(response);
                this.spinnersService.setBusy(false);
            });
    }
}

export default app.component('homePage', {
    templateUrl: 'pages/home/home.html',
    controller: HomePage,
    bindings: {
        currentAuth: '<',
        characters: '<'
    }
});
