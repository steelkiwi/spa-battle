import { FavoritesComponent } from './favorites/favorites.component';
import { HeroesComponent } from './heroes/heroes.component';
import { LoggedInGuard } from './core/logged-in.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const rootRoutes: Routes = [
  // heroes routing is defined in corresponding module
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [LoggedInGuard]
  },
  { path: '**', redirectTo: 'heroes' }
];

@NgModule({
  imports: [
    // Use hash location strategy because app will be deployed to GitHub Pages
    RouterModule.forRoot(rootRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
