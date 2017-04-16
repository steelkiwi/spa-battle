import { HeroDetailsComponent } from './hero-details/hero-details.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroesComponent } from './heroes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const heroesRoutes: Routes = [
  {
    path: 'heroes',
    component: HeroesComponent,
    children: [
      { path: '', component: HeroListComponent, pathMatch: 'full' },
      { path: ':id', component: HeroDetailsComponent }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(heroesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HeroesRoutingModule { }
