import app from 'index';

const config = $mdThemingProvider => {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('blue')
        .backgroundPalette('grey');
};

export default app.config([
    '$mdThemingProvider', config
]);
