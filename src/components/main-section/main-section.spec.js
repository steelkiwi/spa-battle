describe('mainSection component', () => {
    'use strict';

    beforeEach(angular.mock.module('app'));

    it('should render correctly', angular.mock.inject(($rootScope, $compile) => {
        const element = $compile('<main-section></main-section>')($rootScope);
        $rootScope.$digest();
        const h1 = element.find('h1');
        expect(h1.html().trim()).toEqual('BODY');
    }));
});
