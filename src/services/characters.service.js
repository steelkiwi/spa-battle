import app from 'index';
import constants from '../constants/constant';

class CharactersService {
    static get $inject() {
        return [
            '$http',
            'constants',
            '$firebaseObject',
            '$q'
        ];
    }

    constructor($http, constants, $firebaseObject, $q) {
        this.$http = $http;
        this.constants = constants;
        this.$firebaseObject = $firebaseObject;
        this.$q = $q;

        this.providerUrl = 'https://gateway.marvel.com:443/v1/public/characters';
    }

    fetchFavorite(currentAuth, response) {
        this.refFavorites = firebase.database().ref()
            .child('favorites')
            .child(currentAuth.uid);
        return this.$firebaseObject(this.refFavorites).$loaded()
            .then(snapshot => {
                response.forEach(item => {
                    item.isFavorite = angular.isDefined(snapshot[item.id]);
                });
                return response;
            });
    }

    fetchRating(currentAuth, response) {
        this.refHeroRatingUser = firebase.database().ref()
            .child('heroRating')
            .child(currentAuth.uid);
        return this.$firebaseObject(this.refHeroRatingUser).$loaded()
            .then(snapshot => {
                response.forEach(item => {
                    if (angular.isDefined(snapshot[item.id])) {
                        item.rating = snapshot[item.id].rating;
                    } else if (angular.isUndefined(snapshot[item.id])) {
                        item.rating = 0;
                    }
                });
                return response;
            });
    }

    get(currentAuth) {
        let httpResponse;
        const offset = Math.ceil(Math.random(0, 1000) * 1000);
        if (currentAuth) {
            httpResponse = this.$http.get(this.providerUrl + '?apikey=' + this.constants.marvelApiPublicKey +
                '&offset=' + offset + '&limit=' + this.constants.itemsPerPage)
                .then(response => response.data.data.results)
                .then(response => this.fetchRating(currentAuth, response))
                .then(response => this.fetchFavorite(currentAuth, response));
        } else if (currentAuth === null) {
            httpResponse = this.$http.get(this.providerUrl + '?apikey=' + this.constants.marvelApiPublicKey +
                '&offset=' + offset + '&limit=' + this.constants.itemsPerPage)
                .then(response => response.data.data.results);
        }
        return httpResponse;
    }

    getAllFavorite(currentAuth) {
        this.refHeroRatingUser = firebase.database().ref()
            .child('heroRating')
            .child(currentAuth.uid);
        this.refFavorites = firebase.database().ref()
            .child('favorites')
            .child(currentAuth.uid);

        return this.refFavorites
            .once('value')
            .then(snapshot => {
                const rawData = snapshot.exportVal();
                let array = [];
                if (rawData) {
                    array = Object.keys(rawData).map(key => {
                        const item = rawData[key];
                        item.id = key;
                        return item;
                    });
                }
                return this.$q.resolve(array);
            })
            .then(response => this.fetchRating(currentAuth, response))
            .then(response => this.fetchFavorite(currentAuth, response));
    }

    getById(currentAuth, id) {
        let httpResponse;
        if (currentAuth) {
            httpResponse = this.$http.get(this.providerUrl + '/' + id + '?apikey=' + this.constants.marvelApiPublicKey)
                .then(response => response.data.data.results)
                .then(response => this.fetchRating(currentAuth, response))
                .then(response => this.fetchFavorite(currentAuth, response))
                .then(response => response[0]);
        } else if (currentAuth === null) {
            httpResponse = this.$http.get(this.providerUrl + '/' + id + '?apikey=' + this.constants.marvelApiPublicKey)
                .then(response => response.data.data.results[0]);
        }

        return httpResponse;
    }

    setFavorite(currentAuth, item) {
        this.refHeroRatingUser = firebase.database().ref()
            .child('heroRating')
            .child(currentAuth.uid);
        this.refFavorites = firebase.database().ref()
            .child('favorites')
            .child(currentAuth.uid);

        let obj = this.$firebaseObject(this.refFavorites.child(item.id));
        if (item.isFavorite) {
            obj = obj.$remove();
        } else {
            obj.name = item.name;
            obj.description = item.description;
            obj.thumbnail = item.thumbnail;
            obj = obj.$save();
        }
        return obj;
    }

    getByName(currentAuth, name) {
        return this.$http.get(this.providerUrl + '?nameStartsWith=' + name + '&apikey=' + this.constants.marvelApiPublicKey)
            .then(response => response.data.data.results)
            .then(response => this.fetchRating(currentAuth, response))
            .then(response => this.fetchFavorite(currentAuth, response));
    }
}

export default app.service('charactersService', CharactersService);
