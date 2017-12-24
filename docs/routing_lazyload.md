# Lazy loading

## Preparing for Lazy Loading

* Use a feature module
* Routes grouped under a single parent
* Not imported in another module

app-routing.module.ts:

```ts
RouterModule.forRoot([
  { path: 'products', loadChildren: 'app/products/product.module#ProductModule' },
]);
```

loadChildren property:

* The full path to the module
* A hash
* module's class name

## canLoad Guard

* check criteria before loading an  asynchronous route
* prevent loading a route if a user cannot access it

> canLoad guard blocks preloading

## Preloading Feature Modules

![preload feature module](http://om1o84p1p.bkt.clouddn.com/1513958236.png?imageMogr2/thumbnail/!70p)

### preloading strategy

* no preloading
* preload all
* custom

#### Preload all

```ts
// app-routing.module.ts
import { RouterModule, PreloadAllModules } from '@angular/router';

RouterModule.forRoot(
  [
    { path: 'welcome', component: WelcomeComponent },
    { path: 'products', loadChildren: 'app/products/product.module#ProductModule' },
  ],
  { preloadingStrategy: PreloadAllModules },
);
```

#### Custom Loading Strategies

1. Build a preloading strategy service
1. Register the service in an Angular module
1. Set the preloading strategy routing option

##### Build a preloading strategy service

```ts
// selective-strategy.service.ts
import { Injectable } from '@angular/core';
import { Route, PreloadingStrategy } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class SelectiveStrategy implements PreloadingStrategy {
  preload (route: Route, load: Function): Observable<any> {
    if (route.data && route.data['preload']) {
      return load();
    }
    return Observable.of(null);
  }
}
```

##### Register the service in an Angular module

```ts
// app-routing.module.ts
import { SelectiveStrategy } from './selective-strategy.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        { path: 'welcome', component: WelcomeComponent },
        { path: 'products', loadChildren: './app/products/product.module#ProductModule' },
      ],
      { preloadingStrategy: SelectiveStrategy },
    ),
  ],
  providers: [ SelectiveStrategy ],
})
export class AppModule {}
```