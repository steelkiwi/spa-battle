import app from 'index';
import constants from '../constants/constant';

class ChatService {
    static get $inject() {
        return [
            '$q',
            '$firebaseArray',
            'constants',
            'usersService',
            'dateService'
        ];
    }

    constructor($q, $firebaseArray, constants, usersService, dateService) {
        this.$q = $q;
        this.$firebaseArray = $firebaseArray;
        this.constants = constants;
        this.usersService = usersService;
        this.dateService = dateService;
    }

    send(character, message) {
        return this.$firebaseArray(firebase.database().ref()
            .child('heroChatRooms')
            .child(character.id + '_room')
        ).$add(message)
            .then(response => this.getMessages(character))
            .then(response => this.usersService.fetchAuthor(response))
            .then(response => this.dateService.fetchDate(response));
    }

    getMessages(character) {
        return this.$firebaseArray(firebase.database().ref()
            .child('heroChatRooms')
            .child(character.id + '_room')).$loaded();
    }

    shownMessages() {
        return this.$firebaseArray(this.ref.limitToLast(this.constants.messageLimitTo));
    }
}

export default app.service('chatService', ChatService);
