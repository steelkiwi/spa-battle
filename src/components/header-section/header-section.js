import app from 'index';

class HeaderSection {
    static get $inject() {
        return [
            '$firebaseAuth',
            '$transitions',
            '$state',
            '$rootScope',
            'spinnersService',
            'charactersService',
            '$mdDialog'
        ];
    }

    constructor($firebaseAuth, $transitions, $state, $rootScope, spinnersService, charactersService, $mdDialog) {
        this.$firebaseAuth = $firebaseAuth;
        this.$transitions = $transitions;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.spinnersService = spinnersService;
        this.charactersService = charactersService;
        this.$mdDialog = $mdDialog;

        this.auth = this.$firebaseAuth();

        this.auth.$onAuthStateChanged(authData => {
            this.author = authData;
        });

        this.currentState = this.$state.$current.name;

        this.$transitions.onStart({to: '**'}, trans => {
            this.spinnersService.setBusy(true);
        });
        this.$transitions.onSuccess({to: '**'}, trans => {
            this.currentState = trans.$to().name;
            this.spinnersService.setBusy(false);
        });
        this.$transitions.onError({to: '**'}, trans => {
            this.spinnersService.setBusy(false);
            trans.promise
                .catch(response => {
                    if (response === 'AUTH_REQUIRED') {
                        this.loginWithPopUp()
                            .then(response => {
                                this.currentState = trans.$to().name;
                                this.$state.go(this.currentState);
                                this.spinnersService.setBusy(false);
                            })
                            .catch(response => this.$state.go('home'));
                    } else if (response !== 'AUTH_REQUIRED') {
                        this.$state.go('home');
                    }
                });
        });
    }

    loginWithPopUp() {
        return this.auth.$signInWithPopup('google');
    }

    login() {
        this.spinnersService.setBusy(true);
        return this.loginWithPopUp()
            .then(response => {
                this.$rootScope.$emit('login', {message: response});
                return response;
            })
            .catch(response => {})
            .finally(response => this.spinnersService.setBusy(false));
    }

    logout() {
        this.spinnersService.setBusy(true);
        this.auth.$signOut()
            .then(response => {
                this.$rootScope.$emit('logout', {message: response});
                this.spinnersService.setBusy(false);
                this.$state.go('home');
            });
    }

    find(ev) {
        if (!this.author) {
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Please sign in / sign up')
                    .textContent('You should sign in for searching.')
                    .ariaLabel('Please sign in / sign up')
                    .ok('Got it!')
                    .targetEvent(ev)
            );
        }
        if (this.search !== '' && this.author) {
            this.spinnersService.setBusy(true);
            this.charactersService.getByName(this.author, this.search)
                .then(response => this.$rootScope.$emit('search', {message: response}));
        } else if (this.search === '') {
            this.$rootScope.$emit('cancel_search');
        }
    }
}

export default app.component('headerSection', {
    templateUrl: 'components/header-section/header-section.html',
    controller: HeaderSection
});
