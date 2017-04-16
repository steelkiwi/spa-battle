import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroRatingComponent } from './hero-rating/hero-rating.component';
import { UnfavoriteButtonComponent } from './unfavorite-button/unfavorite-button.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HeroRatingComponent,
    UnfavoriteButtonComponent,
    SpinnerComponent
  ],
  exports: [
    HeroRatingComponent,
    UnfavoriteButtonComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
