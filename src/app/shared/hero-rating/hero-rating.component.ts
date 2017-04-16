import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nghb-hero-rating',
  templateUrl: './hero-rating.component.html',
  styleUrls: ['./hero-rating.component.styl']
})
export class HeroRatingComponent {
  @Input() rating: number;
  @Input() readonly: boolean;
  @Output() ratingSet = new EventEmitter();

  onRatingSet(value) {
    if (!this.readonly) {
      this.ratingSet.emit(value);
    }
  }
}
