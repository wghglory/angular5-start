# Route Guard

**canActivate**:

* Guard navigation to a route
* Checks criteria before activating a route
* Commonly used to:
  * Limit route access to specific users
  * Ensure prerequisites are met
* Called when the Url changes to the route

**canActivateChild**:

* Guard navigation to a child route
* Checks criteria before activating a child route
* Commonly used to:
  * Limit access to child routes
  * Ensure prerequisites for child routes are met
* Called when the Url changes to the child route

**canDeactivate**:

* Guard navigation away from a route
* Checks criteria before leaving a route
* Commonly used to:
  * Check for unsaved changes
  * Confirm leaving an incomplete operation
* Called when the Url changes to a different route

**canLoad**:

* Prevent asynchronous routing

**resolve**:

* Prefetch data before activating a route

## Why?

* Limit access to a route
* Warn before leaving a route
* Retrieve data before accessing a route

## Process

canDeactivate --> canLoad --> canActivateChild --> canActivate --> resolve

## Building a Guard Service

```ts
// auth-guard.service.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (private authService: AuthService, private router: Router) {}

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLoggedIn(state.url);
  }

  checkLoggedIn (url: string): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.authService.redirectUrl = url;
    this.router.navigate([ '/login' ]);
    return false;
  }
}
```

## Registering a Guard

```ts
import { AuthGuard } from './auth-guard.service';

@NgModule({
  imports: [...],
  declarations: [...],
  providers: [ AuthGuard, ... ]
})
export class UserModule { }
```

## Guarding a Route

```ts
import { AuthGuard } from './auth-guard.service';

{
  path: ':id',
  component: ProductDetailComponent,
  resolve: { product: ProductResolver },
  canActivate: [ AuthGuard ]
}
```

## Sharing Guard

```ts
RouterModule.forChild([
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductListComponent,
      },
      {
        path: ':id',
        component: ProductDetailComponent,
        resolve: { product: ProductResolver },
      },
      {
        path: ':id/edit',
        component: ProductEditComponent,
        resolve: { product: ProductResolver },
        children: [ ... ],
      },
    ],
  },
]);
```

## Sharing Data

Route parameters:

```ts
canActivate(route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean {
    console.log(route.params['id']);
}
```

Route data:

```ts
canActivate(route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean {
  console.log(route.data['product']); // undefined
}
```

Service property:

```ts
export class AuthService {
  currentUser: IUser;
  redirectUrl: string;
}
```

---

Other guard code: product-guard.service guards product-edit.component.ts