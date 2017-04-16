import { AuthService } from '../../core/auth.service';
import { FavoritesService } from '../../favorites/shared/favorites.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { HeroesService } from '../shared/heroes.service';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../shared/hero.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'nghb-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.styl']
})
export class HeroDetailsComponent implements OnInit, OnDestroy {
  id: Observable<number>;
  hero: Hero;
  isFavorite: boolean;
  rating: number;
  isAuthenticated: boolean;
  processingIsFavorite: boolean;
  savingRating: boolean;
  subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroesService,
    private favoritesService: FavoritesService,
    private authService: AuthService) { }

  ngOnInit() {
    this.id = this.route.params
      .map(newParams => +newParams['id']);

    this.subscriptions.push(
      this.subscribeOnCurrentUser(),
      this.subscribeOnHeroDetails(),
      this.subscribeOnFavoriteInfo(),
      this.subscribeOnRating());
  }


  subscribeOnCurrentUser() {
    return this.authService.currentUser
      .subscribe(user => {
        this.isAuthenticated = Boolean(user);
      });
  }

  subscribeOnHeroDetails() {
    return this.id
      .flatMap(id => this.heroService.getHero(id))
      .subscribe(hero => {
        this.hero = hero;
      }, error => console.error(error));
  }

  subscribeOnFavoriteInfo() {
    return this.favoritesService.isHeroFavorite(this.id)
      .subscribe(isFavorite => {
        this.isFavorite = isFavorite;
      }, error => console.error(error));
  }

  subscribeOnRating() {
    return this.favoritesService.heroRating(this.id)
      .subscribe(value => {
        this.rating = value;
      }, error => console.error(error));
  }

  addToFavorites() {
    this.processingIsFavorite = true;
    this.favoritesService.addHeroToFavorites(this.hero)
      .then(() => {
        this.processingIsFavorite = false;
      })
      .catch(error => {
        this.processingIsFavorite = false;
        console.error(error);
      });
  }

  removeFromFavorites() {
    this.processingIsFavorite = true;
    this.favoritesService.removeHeroFromFavorites(this.hero.id)
      .then(() => {
        this.processingIsFavorite = false;
      })
      .catch(error => {
        this.processingIsFavorite = false;
        console.error(error);
      });
  }

  rate(value) {
    this.savingRating = true;
    this.favoritesService.rateHero(this.hero.id, value)
      .then(() => {
        this.rating = value;
        this.savingRating = false;
      })
      .catch(error => {
        console.error(error);
        this.savingRating = false;
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
