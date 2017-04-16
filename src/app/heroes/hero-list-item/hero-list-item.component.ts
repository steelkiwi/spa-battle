import { Component, Input } from '@angular/core';

@Component({
  selector: 'nghb-hero-list-item',
  templateUrl: './hero-list-item.component.html',
  styleUrls: ['./hero-list-item.component.styl']
})
export class HeroListItemComponent {
  @Input() thumbnail: string;
  @Input() name = '';
  @Input() rating: number;
}
