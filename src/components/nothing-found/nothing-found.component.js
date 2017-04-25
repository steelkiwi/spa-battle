import app from 'index';

class NothingFoundComponent {
    static get $inject() {
        return [];
    }
}

export default app
    .component('nothingFound', {
        templateUrl: 'components/nothing-found/nothing-found.component.html',
        controller: NothingFoundComponent
    });
