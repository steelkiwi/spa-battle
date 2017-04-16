import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from './shared/favorites.service';
import { FavoritesComponent } from './favorites.component';
import { FavoriteHeroesListComponent } from './favorite-heroes-list/favorite-heroes-list.component';
import { FavoriteHeroesListItemComponent } from './favorite-heroes-list-item/favorite-heroes-list-item.component';
import { FavoritesOptionsComponent } from './favorites-options/favorites-options.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    FavoritesComponent,
    FavoriteHeroesListComponent,
    FavoriteHeroesListItemComponent,
    FavoritesOptionsComponent
  ],
  providers: [
    FavoritesService
  ],
  exports: [
    FavoritesComponent
  ]
})
export class FavoritesModule { }
