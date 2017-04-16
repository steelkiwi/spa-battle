import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './auth.service';
import { LoggedInGuard } from './logged-in.guard';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    AuthService,
    LoggedInGuard
  ],
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ]
})
export class CoreModule { }
