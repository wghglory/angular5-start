# Routing

* Routing Basics
* Routing to Features
* Route Parameters
* Prefetching Data using Route Resolvers
* Child Routes
* Grouping and Component-less Routes
* Styling, Animating, and Watching Routes
* Secondary (Auxiliary) Routes
* Route Guards
* Lazy Loading

![routing structure](http://om1o84p1p.bkt.clouddn.com/1513672144.png?imageMogr2/thumbnail/!70p)

## Setting up Routing

1. Define base path

    ```html
    used in development:
    <base href="/">
    http://localhost:3000

    used in production:
      ng build --base-href /hello/
      ng build --bh /hello/
    <base href="/hello">
    http://www.mysite.com/hello
    ```

1. Import Router

    * `RouterModule.forRoot()`: Registers the router service. Used once for the application
    * `RouterModule.forChild()`: Does NOT register the router service. Used in feature modules

    below shows how to use Root Router:

    ```diff
    // app.module.ts
    + import { RouterModule } from '@angular/router';

    @NgModule({
      imports: [
        BrowserModule,
    +   RouterModule.forRoot([])  // one time only!
      ],
      declarations: [
        // ...
      ],
      bootstrap: [ AppComponent ]
    })
    export class AppModule { }
    ```

1. Configure routes

    ```ts
    [
      { path: 'home', component: WelcomeComponent },
      { path: 'welcome', redirectTo: 'home', pathMatch: 'full' },
      { path: '', redirectTo: 'home', pathMatch: 'full' },  // default route
      { path: '**', component: PageNotFoundComponent }  // wildcard route
    ]
    ```

1. Place template and Activate routes by `routerLink`

    ```html
    <ul class='nav navbar-nav'>
      <li><a [routerLink]="['/welcome']">Home</a></li>
      <li><a routerLink='/products'>Product List</a></li>
    </ul>
    <router-outlet></router-outlet>
    ```

## Routing basic demo

创建项目时候自动创建 app-routing module，并引入到了 app.module:

```bash
ng new project --routing
```

app-routing.module.ts demo:

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CharacterListComponent } from './characters/character-list.component';
import { CharacterComponent } from './characters/character.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { VehicleListComponent } from './vehicles/vehicle-list.component';
import { VehicleComponent } from './vehicles/vehicle.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'characters' },
  { path: 'characters', component: CharacterListComponent },
  { path: 'characters/:id', component: CharacterComponent },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicles/:id', component: VehicleComponent },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routableComponents = [
  CharacterListComponent,
  CharacterComponent,
  VehicleListComponent,
  VehicleComponent,
  PageNotFoundComponent
];
```

## Nested routing

1. 创建 admin module 和 admin-routing module。admin module 引入了 admin-routing module
1. 创建 email component 并把它注册到 admin module
1. 手动把 admin module 添加到 app module

```bash
ng g m admin --routing  # admin.module.ts and admin-routing.module.ts
ng g c admin/email  # note this will add email into admin.module
```

> admin-routing 是一个 nested routing。

```typescript
const routes: Routes = [
  {
    path: 'admin',
    component: CharacterListComponent,
    children: [
      { path: '', component: PageNotFoundComponent },
      { path: 'email', component: EmailComponent },
    ]
  }
];
```

## How routing works?

![](http://om1o84p1p.bkt.clouddn.com/1513671982.png?imageMogr2/thumbnail/!70p)
