import app from 'index';

class FavoritesPage {
    static get $inject() {
        return [
            'spinnersService',
            'charactersService',
            '$mdDialog',
            '$mdToast',
            'FirebaseAuthFactory',
            '$firebaseObject',
            '$scope'
        ];
    }

    constructor(spinnersService, charactersService, $mdDialog, $mdToast, FirebaseAuthFactory, $firebaseObject, $scope) {
        this.spinnersService = spinnersService;
        this.charactersService = charactersService;
        this.$mdDialog = $mdDialog;
        this.$mdToast = $mdToast;
        this.FirebaseAuthFactory = FirebaseAuthFactory;
        this.$firebaseObject = $firebaseObject;
        this.$scope = $scope;

        this.FirebaseAuthFactory.$onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                this.currentAuth = firebaseUser;
            } else {
                this.currentAuth = null;
            }
        });
    }

    $onInit() {
        if (this.currentAuth) {
            this.$firebaseObject(firebase.database().ref()
                .child('heroRating')
                .child(this.currentAuth.uid)
            ).$watch(data => {
                this.charactersService.fetchRating(this.currentAuth, this.characters)
                    .then(response => {
                        this.characters = response;
                    });
            });

            this.$firebaseObject(firebase.database().ref()
                .child('favorites')
                .child(this.currentAuth.uid)
            ).$watch(data => {
                this.charactersService.getAllFavorite(this.currentAuth)
                    .then(response => {
                        this.$scope.$apply(() => {
                            this.characters = response;
                        });
                    });
            });
        }
    }

    setFavorite(character) {
        this.spinnersService.setBusy(true);
        this.charactersService.setFavorite(this.currentAuth, character)
            .then(response => this.charactersService.getAllFavorite(this.currentAuth))
            .then(response => {
                this.characters = response;
            })
            .finally(response => {
                this.spinnersService.setBusy(false);
                const message = character.isFavorite ? 'Removed from favorites.' : 'Added to favorites.';
                this.$mdToast.show(
                    this.$mdToast.simple()
                        .textContent(message)
                        .position('top right')
                        .hideDelay(2000)
                );
            });
    }

    showConfirm(ev, character) {
        const confirm = this.$mdDialog.confirm()
            .title('Do you really want to remove it from the favorite list?')
            .ariaLabel('Remove favorite')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');

        this.$mdDialog.show(confirm)
            .then(() => {
                this.setFavorite(character);
            })
            .catch(() => {});
    }
}

export default app.component('favoritesPage', {
    templateUrl: 'pages/favorites/favorites.html',
    controller: FavoritesPage,
    bindings: {
        currentAuth: '<',
        characters: '<'
    }
});
