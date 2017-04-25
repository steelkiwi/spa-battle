import app from 'index';
import spinnersService from '../../services/spinners.service';
import charactersService from '../../services/characters.service';

class DetailPage {
    static get $inject() {
        return [
            'spinnersService',
            'charactersService',
            'chatService',
            'usersService',
            '$mdDialog',
            '$mdToast',
            '$rootScope',
            'FirebaseAuthFactory',
            '$firebaseArray',
            '$firebaseObject',
            'dateService',
            '$document',
            '$q',
            '$timeout'
        ];
    }

    constructor(spinnersService, charactersService, chatService, usersService, $mdDialog, $mdToast, $rootScope, FirebaseAuthFactory, $firebaseArray, $firebaseObject, dateService, $document, $q, $timeout) {
        this.spinnersService = spinnersService;
        this.charactersService = charactersService;
        this.chatService = chatService;
        this.usersService = usersService;
        this.$mdDialog = $mdDialog;
        this.$mdToast = $mdToast;
        this.$rootScope = $rootScope;
        this.FirebaseAuthFactory = FirebaseAuthFactory;
        this.$firebaseArray = $firebaseArray;
        this.$firebaseObject = $firebaseObject;
        this.dateService = dateService;
        this.$document = $document;
        this.$q = $q;
        this.$timeout = $timeout;

        this.$rootScope.$on('login', (state, message) => {
            this.currentAuth = message.message.user;
            this.spinnersService.setBusy(true);
            this.charactersService.getById(this.currentAuth, this.character.id)
                .then(response => {
                    this.character = response;
                    this.spinnersService.setBusy(false);
                });
        });

        this.ratingRef = firebase.database().ref()
            .child('heroRating');
        this.favoriteRef = firebase.database().ref()
            .child('favorites');

        this.FirebaseAuthFactory.$onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                this.currentAuth = firebaseUser;
                this.ratingRef = firebase.database().ref()
                    .child('heroRating')
                    .child(this.currentAuth.uid);
                this.favoriteRef = firebase.database().ref()
                    .child('favorites')
                    .child(this.currentAuth.uid);
            } else {
                this.currentAuth = null;
            }
        });
    }

    $onInit() {
        this.character.image = this.character.thumbnail.path + '.' + this.character.thumbnail.extension;

        if (this.currentAuth) {
            this.ratingRef = firebase.database().ref()
                .child('heroRating')
                .child(this.currentAuth.uid);
            this.favoriteRef = firebase.database().ref()
                .child('favorites')
                .child(this.currentAuth.uid);
        }

        this.$firebaseArray(firebase.database().ref()
            .child('heroChatRooms')
            .child(this.character.id + '_room')
        ).$watch(data => {
            this.usersService.fetchAuthor(this.chatMessages)
                .then(response => this.dateService.fetchDate(response));

            this.$timeout(() => {
                const container = this.$document[0].querySelector('.chat-content');
                container.scrollTop = container.scrollHeight;
            }, 100);
        });

        this.$firebaseObject(this.ratingRef)
            .$watch(data => {
                this.$firebaseObject(this.ratingRef
                    .child(this.character.id)).$loaded()
                    .then(response => {
                        if (response.rating) {
                            this.character.rating = response.rating;
                        }
                    });
            });
        this.$firebaseObject(this.favoriteRef)
            .$watch(data => {
                this.$firebaseObject(this.favoriteRef).$loaded()
                    .then(response => {
                        this.character.isFavorite = response[this.character.id];
                    });
            });
    }

    setFavorite() {
        if (!this.currentAuth) {
            return;
        }
        this.spinnersService.setBusy(true);
        this.charactersService.setFavorite(this.currentAuth, this.character)
            .then(response => {
                this.spinnersService.setBusy(false);

                const message = this.character.isFavorite ? 'Added to favorites.' : 'Removed from favorites.';
                this.$mdToast.show(
                    this.$mdToast.simple()
                        .textContent(message)
                        .position('top right')
                        .hideDelay(2000)
                );
            });
    }

    sendMessage(ev) {
        if (this.chatMessage === '') {
            return this.$q.reject();
        }
        if (this.currentAuth) {
            const message = {
                text: this.chatMessage,
                time: Date.now(),
                uid: this.currentAuth.uid
            };
            this.usersService.set(this.currentAuth)
                .then(response => {
                    this.chatMessage = '';
                })
                .then(response => this.chatService.send(this.character, message))
                .then(response => {
                    this.chatMessages = response;
                });
        } else if (!this.currentAuth) {
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    // .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Please sign in / sign up')
                    .textContent('You should sign in for chatting online.')
                    .ariaLabel('Please sign in / sign up')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        }
    }

    showConfirm(ev) {
        const confirm = this.$mdDialog.confirm()
            .title('Do you really want to remove it from the favorite list?')
            .ariaLabel('Remove favorite')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');

        this.$mdDialog.show(confirm)
            .then(() => {
                this.setFavorite();
            })
            .catch(() => {});
    }
}

export default app.component('detailPage', {
    templateUrl: 'pages/detail/detail.html',
    controller: DetailPage,
    bindings: {
        currentAuth: '<',
        character: '<',
        chatMessages: '<'
    }
});
