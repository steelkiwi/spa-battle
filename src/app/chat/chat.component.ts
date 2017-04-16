import { Message } from './shared/message.model';
import { Subscription } from 'rxjs/Rx';
import { AuthService } from '../core/auth.service';
import { User } from '../core/user.model';
import { ChatService } from './shared/chat.service';
import { Component, OnInit, OnChanges, OnDestroy, Input, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'nghb-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.styl']
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() heroId: number;
  messages: Array<Message>;
  private messagesSub: Subscription;
  currentUser: User;
  private userSub: Subscription;
  @ViewChild('chatMessages') private scrollContainer: ElementRef;
  private needToScroll: boolean;

  constructor(
    private chatService: ChatService,
    private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.currentUser
      .subscribe(user => {
        this.currentUser = user;
        this.needToScroll = true;
      });
  }

  ngOnChanges() {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
    this.messagesSub = this.chatService.heroRoomMessages(this.heroId)
      .subscribe(messages => {
        this.messages = messages;
        this.needToScroll = true;
      });
  }

  ngAfterViewChecked() {
    if (this.needToScroll) {
      this.needToScroll = false;
      this.scrollToLatestMessage();
    }
  }

  scrollToLatestMessage() {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.userSub.unsubscribe();
  }
}
