import { Component } from '@angular/core';

import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  pageTitle = 'Product Management';

  constructor (private authService: AuthService) {}

  logOut (): void {
    this.authService.logout();
    console.log('Log out');
  }
}
