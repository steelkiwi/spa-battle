import { FormControl } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ChatService } from '../shared/chat.service';

@Component({
  selector: 'nghb-compose-message',
  templateUrl: './compose-message.component.html',
  styleUrls: ['./compose-message.component.styl']
})
export class ComposeMessageComponent {
  @Input() heroId: number;
  messageTextControl = new FormControl();

  constructor(private chatService: ChatService) { }

  messageInputHandler(keyUpEvent: any) {
    if (keyUpEvent.keyCode === 13 && this.messageTextControl.value) {
      this.chatService.sendMessageToHeroRoom(this.heroId, this.messageTextControl.value)
        .catch(error => console.error(error));
      this.messageTextControl.reset();
    }
  }
}
