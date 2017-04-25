import app from 'index';

class SpinnersService {
    static get $inject() {
        return [
            '$rootScope'
        ];
    }

    constructor($rootScope) {
        this.$rootScope = $rootScope;
    }

    setBusy(value) {
        this.isBusy = value;
        this.$rootScope.$emit('busy', {busy: this.isBusy});
    }
}

export default app.service('spinnersService', SpinnersService);
