import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from './shared/chat.service';
import { ChatComponent } from './chat.component';
import { MessageComponent } from './message/message.component';
import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MomentModule} from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MomentModule
  ],
  declarations: [ChatComponent, MessageComponent, ComposeMessageComponent],
  providers: [
    ChatService
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }
