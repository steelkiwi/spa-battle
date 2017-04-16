import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { User } from './user.model';
import { Observable, Subscription } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';

@Injectable()
export class AuthService {
  currentUser: Observable<User>;
  currentUserSnapshot: User;

  constructor(private firebase: AngularFire, private router: Router) {
    this.currentUser = this.firebase.auth
      .map(authData => {
        if (!authData) {
          return null;
        }
        let user: User;
        // With this verification/transformation we can easily add other providers later
        switch (authData.provider) {
          case AuthProviders.Google:
            user = {
              name: authData.auth.displayName,
              photo: authData.auth.photoURL,
              uid: authData.auth.uid
            };
            break;
          default:
            user = null;
        }
        return user;
      });

    // Flat presentation of current user
    this.currentUser.subscribe(user => {
      this.currentUserSnapshot = user;
    });

    // Handle new users subscription
    this.currentUser.subscribe(this.checkAndSaveNewUser.bind(this));
  }

  /**
   * Login with Google account via Firebase pop-up
   *
   * @memberOf AuthService
   */
  loginGoogle() {
    this.firebase.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    });
  }

  /**
   * Logout for all account types
   *
   * @memberOf AuthService
   */
  logout() {
    this.firebase.auth.logout();

    if (this.router.url === '/favorites') {
      this.router.navigate(['/']);
    }
  }

  /**
   * Check if user doesn't exist in DB and add him if so
   *
   * @private
   * @param {User} loggedInUser
   * @returns
   *
   * @memberOf AuthService
   */
  private checkAndSaveNewUser(loggedInUser: User) {
    if (!loggedInUser) {
      return;
    }
    const user = this.firebase.database.object(`/users/${loggedInUser.uid}`);

    user
      .take(1)
      .subscribe(userDb => {
        if (!userDb.$exists()) {
          // User has logged in first time, save him to DB
          user.set({ name: loggedInUser.name, photo: loggedInUser.photo });
        }
      });
  }
}
