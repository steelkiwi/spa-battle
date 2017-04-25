import app from 'index';

class SpinnerComponent {
    static get $inject() {
        return [
            '$rootScope'
        ];
    }

    constructor($rootScope) {
        this.$rootScope = $rootScope;

        this.shouldShow = true;
        this.$rootScope.$on('busy', (event, message) => {
            this.shouldShow = message.busy;
        });
    }
}

export default app.component('spinner', {
    templateUrl: 'components/spinner/spinner.component.html',
    controller: SpinnerComponent
});
