import { SharedModule } from '../shared/shared.module';
import { HeroesRoutingModule } from './heroes-routing.module';
import { ChatModule } from '../chat/chat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroesComponent } from './heroes.component';
import { HeroesService } from './shared/heroes.service';
import { HeroListComponent } from './hero-list/hero-list.component';
import { HeroListItemComponent } from './hero-list-item/hero-list-item.component';
import { HeroListOptionsComponent } from './hero-list-options/hero-list-options.component';
import { HeroDetailsComponent } from './hero-details/hero-details.component';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    ChatModule,
    HeroesRoutingModule,
    SharedModule
  ],
  declarations: [
    HeroesComponent,
    HeroListComponent,
    HeroListItemComponent,
    HeroListOptionsComponent,
    HeroDetailsComponent
  ],
  providers: [
    HeroesService
  ],
  exports: [
    HeroesComponent,
    HttpModule
  ]
})
export class HeroesModule { }
