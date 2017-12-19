import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  pageTitle = 'Product Management';

  constructor (public authService: AuthService, private router: Router) {}

  logOut (): void {
    this.authService.logout();
    this.router.navigateByUrl('/welcome');
  }
}
