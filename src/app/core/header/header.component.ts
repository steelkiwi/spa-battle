import { User } from '../user.model';
import 'rxjs/add/operator/filter';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nghb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  showSearchComponent = false;
  searchString = '';

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.authService.currentUser
      .subscribe(currentUser => {
        this.currentUser = currentUser;
      });

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(navigationEndEvent => {
        const urlWithQueryParams = (<NavigationEnd>navigationEndEvent).urlAfterRedirects;
        if (urlWithQueryParams === '/heroes') {
          // Reset search
          this.router.navigate(['/heroes']);
          this.searchString = '';
        }
        const url = urlWithQueryParams.split('?')[0];
        this.showSearchComponent = url === '/heroes';
      });
  }

  searchChange() {
    if (this.searchString) {
      this.router.navigate(['/heroes'], { queryParams: { search: this.searchString } });
    } else {
      this.router.navigate(['/heroes']);
    }
  }
}
