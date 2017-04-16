import { AuthService } from '../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FavoritesService, HeroRating } from '../../favorites/shared/favorites.service';
import { Hero } from '../shared/hero.model';
import { HeroesService } from '../shared/heroes.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'nghb-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.styl']
})
export class HeroListComponent implements OnInit, OnDestroy {
  heroes: Array<Hero> = [];
  ratings: Array<HeroRating> = [];
  favorites: Array<Hero> = [];
  isAuthenticated: boolean;
  currentSort: any;
  hideRated = false;
  hideFavorites = false;
  searchingHeroesSub: Subscription;
  loading: boolean;
  subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private heroesService: HeroesService,
    private favoritesService: FavoritesService,
    private authService: AuthService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.subscribeOnQueryParams(),
      this.subscribeOnHeroRating(),
      this.subscribeOnCurrentUser(),
      this.subscribeOnFavorites());
  }

  sort(sortBy: any) {
    this.currentSort = +sortBy;
    this.heroes = this.heroesService.sortHeroes(this.heroes, this.currentSort);
  }

  subscribeOnQueryParams() {
    return this.route.queryParams
      .subscribe(newParams => {
        if (newParams && newParams.search) {
          this.searchHeroes(newParams.search);
        } else {
          this.getSomeRandomHeroes();
        }
      });
  }

  subscribeOnCurrentUser() {
    return this.authService.currentUser
      .subscribe(user => {
        this.isAuthenticated = Boolean(user);
      });
  }

  subscribeOnHeroRating() {
    return this.favoritesService.heroesRating()
      .subscribe(ratings => {
        this.ratings = ratings;
        this.checkAndSetRating();
      }, error => console.error(error));
  }

  checkAndSetRating() {
    this.heroes = this.heroes
      .map(hero => {
        const foundRating = this.ratings.find(rating => rating.id === hero.id);
        if (foundRating) {
          hero.rating = foundRating.value;
        } else {
          delete hero.rating;
        }
        return hero;
      });
  }

  subscribeOnFavorites() {
    return this.favoritesService.favoriteHeroes()
      .subscribe(favorites => {
        this.favorites = favorites;
        this.checkAndSetFavorites();
      });
  }

  checkAndSetFavorites() {
    this.heroes = this.heroes
      .map(hero => {
        const foundFavorite = this.favorites.find(favorite => favorite.id === hero.id);
        hero.isFavorite = Boolean(foundFavorite);
        return hero;
      });
  }

  getSomeRandomHeroes() {
    // No need to unsubscribe from this
    // Due to http request works once and completes
    this.loading = true;
    if (this.searchingHeroesSub) {
      // Previous request was search
      this.searchingHeroesSub.unsubscribe();
      this.heroes = [];
    }
    this.heroesService.getRandomHeroes()
      .finally(() => {
        this.loading = false;
      })
      .subscribe(someHeroes => {
        this.heroes = this.heroes.concat(someHeroes);
        this.checkAndSetRating();
        this.checkAndSetFavorites();
        this.sort(this.currentSort);
      }, error => console.error(error));
  }

  searchHeroes(nameStartsWith: string) {
    // No need to unsubscribe from this
    // Due to http request works once and completes
    this.loading = true;
    if (this.searchingHeroesSub && !this.searchingHeroesSub.closed) {
      // Previous search request is not finished yet, cancel it
      this.searchingHeroesSub.unsubscribe();
    }
    this.searchingHeroesSub = this.heroesService.searchHeroes(nameStartsWith)
      .finally(() => {
        this.loading = false;
      })
      .subscribe(someHeroes => {
        this.heroes = someHeroes;
        this.checkAndSetRating();
        this.checkAndSetFavorites();
        this.sort(this.currentSort);
      }, error => console.error(error));

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
