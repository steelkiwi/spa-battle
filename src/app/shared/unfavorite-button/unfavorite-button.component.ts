import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nghb-unfavorite-button',
  templateUrl: './unfavorite-button.component.html',
  styleUrls: ['./unfavorite-button.component.styl']
})
export class UnfavoriteButtonComponent {
  @Output() delete = new EventEmitter();
}
