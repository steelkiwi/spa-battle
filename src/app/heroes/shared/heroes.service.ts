import { Hero } from './hero.model';
import { RequestOptions, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

export enum HeroesListSortOptions {
  noSort,
  nameAsc,
  nameDesc
};

@Injectable()
export class HeroesService {
  // Use factual number of heroes for simplification
  // Possible improvement - start from low value and update it with data from API response
  private heroesNumber = 1485;
  private randomPortionSize = 10;

  constructor(private http: Http) { }

  /**
   * Load random set of 10 heroes (heroes are in turn)
   *
   * @returns {Observable<Array<Hero>>}
   *
   * @memberOf HeroesService
   */
  getRandomHeroes(): Observable<Array<Hero>> {
    const search = new URLSearchParams();
    search.append('apikey', environment.marvelConfig.apiKey);
    search.append('limit', '10');
    const randomOffset = Math.floor(Math.random() * (this.heroesNumber - this.randomPortionSize));
    search.append('offset', randomOffset.toString(10));
    const options = new RequestOptions({ search });

    return this.http.get(`${environment.marvelConfig.apiUrl}/characters`, options)
      .map(responseRawHeroes => {
        const rawHeroes = responseRawHeroes.json().data.results;
        return rawHeroes.map(rawHero => new Hero(rawHero));
      });
  }

  /**
   * Load all heros who's name starts with provided search string
   *
   * @param {string} nameStartsWith
   * @returns {Observable<Array<Hero>>}
   *
   * @memberOf HeroesService
   */
  searchHeroes(nameStartsWith: string): Observable<Array<Hero>> {
    const search = new URLSearchParams();
    search.append('apikey', environment.marvelConfig.apiKey);
    search.append('nameStartsWith', nameStartsWith);
    const options = new RequestOptions({ search });

    return this.http.get(`${environment.marvelConfig.apiUrl}/characters`, options)
      .map(responseRawHeroes => {
        const rawHeroes = responseRawHeroes.json().data.results;
        return rawHeroes.map(rawHero => new Hero(rawHero));
      });
  }

  /**
   * Loads hero details by id
   *
   * @param {number} heroId
   * @returns {Observable<Hero>}
   *
   * @memberOf HeroesService
   */
  getHero(heroId: number): Observable<Hero> {
    const search = new URLSearchParams();
    search.append('apikey', environment.marvelConfig.apiKey);
    const options = new RequestOptions({ search });

    return this.http.get(`${environment.marvelConfig.apiUrl}/characters/${heroId}`, options)
      .map(responseRawHero => {
        const rawHero = responseRawHero.json().data.results[0];
        return new Hero(rawHero);
      });
  }

  /**
   * Sorts heroes by passed parameter
   *
   * @param {Array<Hero>} heroes
   * @param {*} sortBy
   * @returns {Array<Hero>}
   *
   * @memberOf HeroesService
   */
  sortHeroes(heroes: Array<Hero>, sortBy: any): Array<Hero> {
    let sortedHeroes: Array<Hero>;
    switch (sortBy) {
      default:
      case HeroesListSortOptions.noSort:
        // Do nothing
        sortedHeroes = heroes;
        break;
      case HeroesListSortOptions.nameAsc:
        sortedHeroes = heroes.sort((a, b) => {
          const aLower = a.name.toLowerCase();
          const bLower = b.name.toLowerCase();
          if (aLower < bLower) {
            return -1;
          }
          if (aLower > bLower) {
            return 1;
          }
          return 0;
        });
        break;
      case HeroesListSortOptions.nameDesc:
        sortedHeroes = heroes.sort((a, b) => {
          const aLower = a.name.toLowerCase();
          const bLower = b.name.toLowerCase();
          if (aLower > bLower) {
            return -1;
          }
          if (aLower < bLower) {
            return 1;
          }
          return 0;
        });
        break;
    }
    return sortedHeroes;
  }
}
