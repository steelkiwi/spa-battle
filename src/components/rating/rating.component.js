import app from 'index';
import spinnersService from '../../services/spinners.service';

class RatingComponent {
    static get $inject() {
        return [
            '$firebaseObject',
            'spinnersService',
            'FirebaseAuthFactory',
            '$mdToast',
            'constants',
            '$rootScope'
        ];
    }

    constructor($firebaseObject, spinnersService, FirebaseAuthFactory, $mdToast, constants, $rootScope) {
        this.$firebaseObject = $firebaseObject;
        this.spinnersService = spinnersService;
        this.FirebaseAuthFactory = FirebaseAuthFactory;
        this.$mdToast = $mdToast;
        this.constants = constants;
        this.$rootScope = $rootScope;

        this.$rootScope.$on('login', (state, message) => {
            this.currentAuth = message.message.user;
            this.refHeroRatingCharacter = firebase.database().ref()
                .child('heroRating')
                .child(this.currentAuth.uid)
                .child(this.character.id);
        });
    }

    $onInit() {
        this.FirebaseAuthFactory.$waitForSignIn()
            .then(response => {
                this.currentAuth = response;
                this.refHeroRatingCharacter = '';
                if (this.currentAuth) {
                    this.refHeroRatingCharacter = firebase.database().ref()
                        .child('heroRating')
                        .child(this.currentAuth.uid)
                        .child(this.character.id);
                }
            });
    }

    setRating(newRating) {
        if (!this.currentAuth) {
            return;
        }

        this.spinnersService.setBusy(true);

        const obj = this.$firebaseObject(this.refHeroRatingCharacter);
        obj.rating = newRating;
        obj.$save().then(response => {
            this.character.rating = newRating;
            this.spinnersService.setBusy(false);
            this.$mdToast.show(
                this.$mdToast.simple()
                    .textContent('Rating changed.')
                    .position('top right')
                    .hideDelay(2000)
            );
        });
    }
}

export default app.component('rating', {
    templateUrl: 'components/rating/rating.component.html',
    controller: RatingComponent,
    bindings: {
        character: '<'
    }
});
