import * as moment from 'moment';
import { User } from '../../core/user.model';

export class Message {
  text: string;
  private time: string;
  user: User;
  constructor(rawMessage: any, user: User) {
    this.text = rawMessage.text;
    this.time = rawMessage.time;
    this.user = user;
  }

  get timeMoment() {
    return moment(this.time);
  }
}
