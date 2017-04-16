import { HeroesListSortOptions } from '../../heroes/shared/heroes.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nghb-favorites-options',
  templateUrl: './favorites-options.component.html',
  styleUrls: ['./favorites-options.component.styl']
})
export class FavoritesOptionsComponent {
  sortOptions = HeroesListSortOptions;
  @Output() sortHeroes = new EventEmitter();
  @Output() hideRatedHeroes = new EventEmitter();
}
