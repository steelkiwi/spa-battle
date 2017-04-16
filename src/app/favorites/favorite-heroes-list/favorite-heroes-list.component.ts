import { HeroesService, HeroesListSortOptions } from '../../heroes/shared/heroes.service';
import { FavoritesService } from '../shared/favorites.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Hero } from '../../heroes/shared/hero.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'nghb-favorite-heroes-list',
  templateUrl: './favorite-heroes-list.component.html',
  styleUrls: ['./favorite-heroes-list.component.styl']
})
export class FavoriteHeroesListComponent implements OnInit, OnDestroy {
  favorites: Observable<Array<Hero>>;
  sortBy = new BehaviorSubject(HeroesListSortOptions.noSort);
  hideRated = false;
  sub: Subscription;

  constructor(
    private favoritesService: FavoritesService,
    private heroesService: HeroesService) { }

  ngOnInit() {
    // No need to unsubscribe from this, async pipe will do the job
    this.favorites = this.favoritesAndRatings();
  }

  favoritesAndRatings() {
    return Observable.combineLatest(
      this.favoritesService.favoriteHeroes(),
      this.favoritesService.heroesRating(),
      this.sortBy)
      .map(favoritesRatingsAndSort => {
        const [favorites, ratings, sortBy] = favoritesRatingsAndSort;

        const favoritesWithRatings = favorites.map(favorite => {
          const foundRating = ratings.find(rating => rating.id === favorite.id);
          favorite.rating = foundRating ? foundRating.value : undefined;
          return favorite;
        });
        return this.heroesService.sortHeroes(favoritesWithRatings, sortBy);
      });
  }

  removeFromFavorites(heroId) {
    this.favoritesService.removeHeroFromFavorites(heroId)
      .catch(error => {
        console.error(error);
      });
  }

  setSort(sortBy: any) {
    this.sortBy.next(+sortBy);
  }

  ngOnDestroy() {
    this.sortBy.complete();
    this.sortBy.unsubscribe();
  }
}
