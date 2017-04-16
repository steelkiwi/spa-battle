import { AuthService } from '../../core/auth.service';
import { Message } from './message.model';
import { Observable } from 'rxjs/Rx';
import { AngularFire } from 'angularfire2';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class ChatService {

  constructor(
    private firebase: AngularFire,
    private authService: AuthService) { }

  /**
   * Sends message to hero room under logged in user
   *
   * @param {number} heroId
   * @param {string} text
   * @returns {firebase.Promise<void>}
   *
   * @memberOf ChatService
   */
  sendMessageToHeroRoom(heroId: number, text: string): firebase.Promise<void> {
    if (!this.authService.currentUserSnapshot) {
      return firebase.Promise.reject(new Error('User has to be logged in to send messages'));
    }
    const uid = this.authService.currentUserSnapshot.uid;
    return this.firebase.database.list(`/heroChatRooms/${heroId}_room`)
      .push({
        uid,
        text,
        time: moment().toISOString()
      });
  }

  /**
   * Returns list of messages from hero-related chat room
   *
   * @param {number} heroId
   * @returns {Observable<Array<Message>>}
   *
   * @memberOf ChatService
   */
  heroRoomMessages(heroId: number): Observable<Array<Message>> {
    return Observable.combineLatest(
      this.firebase.database.list(`/heroChatRooms/${heroId}_room`),
      this.firebase.database.list((`/users`)))
      .map(messagesAndUsers => {
        const [rawMessages, users] = messagesAndUsers;
        return rawMessages
          .map(rawMessage => {
            const rawUser = users.find(user => user.$key === rawMessage.uid);
            return new Message(rawMessage, {
              name: rawUser.name,
              photo: rawUser.photo,
              uid: rawUser.$key
            });
          });
      });
  }

}
