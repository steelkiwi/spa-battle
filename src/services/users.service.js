import app from 'index';
import constants from '../constants/constant';

class UsersService {
    static get $inject() {
        return [
            '$q',
            '$firebaseObject',
            'constants'
        ];
    }

    constructor($q, $firebaseObject, constants) {
        this.$q = $q;
        this.$firebaseObject = $firebaseObject;
        this.constants = constants;

        this.ref = firebase.database().ref()
            .child('users');
    }

    fetchAuthor(response) {
        return this.getAll()
            .then(snapshot => {
                response.forEach(item => {
                    if (item.uid) {
                        item.author = snapshot[item.uid];
                    }
                });
                return response;
            });
    }

    set(user) {
        return this.getAll()
            .then(response => {
                if (!response[user.uid]) {
                    const obj = this.$firebaseObject(this.ref.child(user.uid));
                    obj.name = user.displayName;
                    obj.photo = user.photoURL;
                    obj.$save();
                }
                return response;
            });
    }

    getAll() {
        return this.$firebaseObject(this.ref).$loaded();
    }
}

export default app.service('usersService', UsersService);
