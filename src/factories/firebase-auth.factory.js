import app from 'index';

export default app.factory('FirebaseAuthFactory', ['$firebaseAuth',
    $firebaseAuth => {
        return $firebaseAuth();
    }
]);
