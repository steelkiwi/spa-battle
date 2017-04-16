import { HeroesListSortOptions } from '../shared/heroes.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nghb-hero-list-options',
  templateUrl: './hero-list-options.component.html',
  styleUrls: ['./hero-list-options.component.styl']
})
export class HeroListOptionsComponent {
  sortOptions = HeroesListSortOptions;
  @Input() showFilters;
  @Output() sortHeroes = new EventEmitter();
  @Output() hideRatedHeroes = new EventEmitter();
  @Output() hideFavoriteHeroes = new EventEmitter();
}
