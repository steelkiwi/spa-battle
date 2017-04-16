import { Message } from '../shared/message.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'nghb-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.styl']
})
export class MessageComponent {
  @Input() message: Message;
  @Input() isMyMessage: boolean;
}
