import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Hero } from '../../heroes/shared/hero.model';
import { AuthService } from '../../core/auth.service';
import { AngularFire } from 'angularfire2';
import { Injectable } from '@angular/core';

export interface HeroRating {
  id: number;
  value: number;
}

@Injectable()
export class FavoritesService {

  constructor(
    private firebase: AngularFire,
    private authService: AuthService) { }

  /**
   * Saves hero as logged in user favorite
   *
   * @param {Hero} hero
   * @returns {firebase.Promise<any>}
   *
   * @memberOf FavoritesService
   */
  addHeroToFavorites(hero: Hero): firebase.Promise<any> {
    if (!this.authService.currentUserSnapshot) {
      return firebase.Promise.reject(new Error('User has to be logged in to add heroes to favorites'));
    }
    const uid = this.authService.currentUserSnapshot.uid;
    return this.firebase.database.object(`/favorites/${uid}/${hero.id}`).set({
      name: hero.name,
      description: hero.description,
      thumbnail: hero.thumbnail
    });
  }

  /**
   * Checks if hero is added to user favorites
   *
   * @param {Observable<number>} heroId
   * @returns {Observable<boolean>}
   *
   * @memberOf FavoritesService
   */
  isHeroFavorite(heroId: Observable<number>): Observable<boolean> {
    return Observable.combineLatest(heroId, this.authService.currentUser)
      .flatMap(idAndUser => {
        const [id, user] = idAndUser;
        if (!user) {
          // Empty favorite entires for unauthenticated
          return Observable.of();
        }

        return this.firebase.database.object(`/favorites/${user.uid}/${id}`)
          .map(favoriteEntry => favoriteEntry.$exists());
      });
  }

  /**
   * Removes hero from user favorites
   *
   * @param {number} heroId
   * @returns {firebase.Promise<any>}
   *
   * @memberOf FavoritesService
   */
  removeHeroFromFavorites(heroId: number): firebase.Promise<any> {
    if (!this.authService.currentUserSnapshot) {
      return firebase.Promise.reject(new Error('User has to be logged in to remove heroes from favorites'));
    }
    const uid = this.authService.currentUserSnapshot.uid;
    return this.firebase.database.object(`/favorites/${uid}/${heroId}`).remove();
  }

  /**
   * Sets hero rating (in space of logged in user)
   *
   * @param {number} heroId
   * @param {number} value
   * @returns {firebase.Promise<void>}
   *
   * @memberOf FavoritesService
   */
  rateHero(heroId: number, value: number): firebase.Promise<void> {
    if (!this.authService.currentUserSnapshot) {
      return firebase.Promise.reject(new Error('User has to be logged in to rate heroes'));
    }
    const uid = this.authService.currentUserSnapshot.uid;
    return this.firebase.database.object(`/heroRating/${uid}/${heroId}`).set({ rating: value });
  }

  /**
   * Get rating information for hero
   * Returns undefined if no rating or user is unauthenticated
   *
   * @param {Observable<number>} heroId
   * @returns {Observable<number>}
   *
   * @memberOf FavoritesService
   */
  heroRating(heroId: Observable<number>): Observable<number> {
    return Observable.combineLatest(heroId, this.authService.currentUser)
      .flatMap(idAndUser => {
        const [id, user] = idAndUser;
        if (!user) {
          // Empty favorite entires for unauthenticated
          return Observable.of();
        }
        return this.firebase.database.object(`/heroRating/${user.uid}/${id}`)
          .map(rating => rating.rating);
      });
  }

  /**
   * Get rating information for all heroes rated by logged in user
   *
   * @returns {Observable<Array<HeroRating>>}
   *
   * @memberOf FavoritesService
   */
  heroesRating(): Observable<Array<HeroRating>> {
    return this.authService.currentUser
      .flatMap(user => {
        if (!user) {
          // Empty rating entires for unauthenticated
          return Observable.of([]);
        }
        return this.firebase.database.list(`/heroRating/${user.uid}`)
          .map(ratings => {
            return ratings.map(rating => ({ id: +rating.$key, value: rating.rating }));
          });
      });
  }
  /**
   * Get favorite heroes for logged in user
   *
   * @returns {Observable<Array<Hero>>}
   *
   * @memberOf FavoritesService
   */
  favoriteHeroes(): Observable<Array<Hero>> {
    return this.authService.currentUser
      .flatMap(user => {
        if (!user) {
          // Empty favorite entires for unauthenticated
          return Observable.of([]);
        }
        return this.firebase.database.list(`/favorites/${user.uid}`)
          .map(favorites => {
            return favorites.map(rawFavorite => {
              const favorite = new Hero(rawFavorite);
              favorite.isFavorite = true;
              return favorite;
            });
          });
      });
  }
}
