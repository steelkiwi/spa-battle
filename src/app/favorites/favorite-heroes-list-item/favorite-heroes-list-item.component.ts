import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nghb-favorite-heroes-list-item',
  templateUrl: './favorite-heroes-list-item.component.html',
  styleUrls: ['./favorite-heroes-list-item.component.styl']
})
export class FavoriteHeroesListItemComponent {
  @Input() thumbnail: string;
  @Input() name = '';
  @Input() rating: number;
  @Input() isFavorite: number;
  @Input() id: number;
  @Output() unfavorite = new EventEmitter();
}
