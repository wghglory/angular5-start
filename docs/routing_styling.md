# Styling, Animating, and Watching Routes

## Styling the Selected Route

For an exact path match use `routerLinkActiveOptions`.

```html
<a [routerLink]="['info']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
  Basic Information
</a>
```

## Animating Route Transitions

* CSS Animation (code see `style.css`)
  * Quick and easy
  * Define some CSS
  * Every route in every component is animated!
  * Not truly animating our routes
* Angular Animation
  * More complex
  * Configure the animation
  * Apply it to every component

## Routing Events

* NavigationStart
* RoutesRecognized
* NavigationEnd
* NavigationCancel
* NavigationError

## Watching Routing Events

app-routing.module.ts

```ts
imports: [
  RouterModule.forRoot(
    [
      { path: 'welcome', component: WelcomeComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent },
    ],
    { enableTracing: true },
  ),
];
```

### Reacting to Routing Events

* Display a spinner
* Log actions
* Execute logic

```ts
this.router.events.subscribe((routerEvent: Event) => {
  if (routerEvent instanceof NavigationStart) {
    // ...
  }
});
```

app.component.ts:

```ts
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { Component } from '@angular/core';

import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  loading = true;

  constructor (public authService: AuthService, private router: Router) {
    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent (routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.loading = false;
    }
  }
}
```

app.component.html:

```html
<span class="glyphicon glyphicon-refresh glyphicon-spin spinner" *ngIf="loading"></span>
```