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

## Setting up base/main Routing

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
    // app.module.ts
    [
      { path: 'home', component: WelcomeComponent },
      { path: 'welcome', redirectTo: 'home', pathMatch: 'full' },
      { path: '', redirectTo: 'home', pathMatch: 'full' },  // default route
      { path: '**', component: PageNotFoundComponent }  // wildcard route
    ]
    ```

1. It's better to create app-routing.module.ts

    ```ts
    import { NgModule } from '@angular/core';
    import { RouterModule } from '@angular/router';

    import { AppComponent } from './app.component';
    import { WelcomeComponent } from './home/welcome.component';
    import { CustomerTemplateDrivenComponent } from './customer-template-drive/customer-template-drive.component';
    import { CustomerReactiveComponent } from './customer-reactive/customer-reactive.component';
    import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

    @NgModule({
      imports: [
        // order matters
        RouterModule.forRoot([
          { path: 'welcome', component: WelcomeComponent },
          { path: 'customer-template-driven', component: CustomerTemplateDrivenComponent },
          { path: 'customer-reactive', component: CustomerReactiveComponent },
          { path: '', redirectTo: 'welcome', pathMatch: 'full' },
          { path: '**', component: PageNotFoundComponent },
        ]),
      ],
      exports: [RouterModule],
    })
    export class AppRoutingModule {}
    ```

    Then app.module.ts:

    ```diff
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { HttpClientModule } from '@angular/common/http';

    import { AppComponent } from './app.component';
    import { WelcomeComponent } from './home/welcome.component';
    import { CustomerTemplateDrivenComponent } from './customer-template-drive/customer-template-drive.component';
    import { CustomerReactiveComponent } from './customer-reactive/customer-reactive.component';
    import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

    /* app routing module */
    import { AppRoutingModule } from './app-routing.module';

    /* feature modules */
    import { ProductModule } from './products/product.module';
    import { UserModule } from './user/user.module';
    import { MessageModule } from './message/message.module';

    @NgModule({
      declarations: [
        AppComponent,
        WelcomeComponent,
        CustomerTemplateDrivenComponent,
        CustomerReactiveComponent,
        PageNotFoundComponent,
      ],
      imports: [
        BrowserModule,
        FormsModule, // template-driven
        ReactiveFormsModule, // reactive
        HttpClientModule,

    +    // order matters, must after RouterModule.forRoot
    +    ProductModule,
    +    UserModule,
    +    MessageModule,
    +    // must at last
    +    AppRoutingModule,
      ],
      bootstrap: [AppComponent],
    })
    export class AppModule {}
    ```

1. Place template and Activate routes by `routerLink`

    ```html
    <ul class='nav navbar-nav'>
      <li><a [routerLink]="['/welcome']">Home</a></li>
      <li><a routerLink='/products'>Product List</a></li>
    </ul>
    <router-outlet></router-outlet>
    ```

## Routing to feature modules

![routing to feature modules](http://om1o84p1p.bkt.clouddn.com/1513686661.png?imageMogr2/thumbnail/!70p)

### Setting up for Feature Module Routing and Route Parameters

**Route Path Naming Strategies**：

```js
productList: products
productDetail: products/:id
productEdit: products/:id/edit
```

> feature module must be included in app.module, above app-routing.module

1. Import Router (product feature module)

    ```diff
    + import { RouterModule } from '@angular/router';
    // ...
    @NgModule({
      imports: [
        SharedModule,
    +   RouterModule.forChild([
    +     { path: 'products', component: ProductListComponent },
    +     {
    +       path: 'products/:id',
    +       canActivate: [ProductDetailGuard],
    +       component: ProductDetailComponent
    +     },
    +     {
    +       path: 'products/:id/edit',
    +       canDeactivate: [ProductEditGuard],
    +       component: ProductEditComponent
    +     }
    +   ]),
      ],
      declarations: [
        ProductListComponent,
      ],
    })
    export class ProductModule { }
    ```

1. Activate routes

    ```ts
    this.router.navigate(['/welcome']);       // Standard syntax
    this.router.navigate('/welcome'); // Short-cut syntax
    this.router.navigateByUrl('/welcome');    // Complete Url path
    this.router.navigate(['/products', this.product.id]);  // with parameter
    ```

    ```text
    http://localhost:3000/products(popup:messages)  // current route
    http://localhost:3000/welcome(popup:messages)   // navigate()
    http://localhost:3000/welcome                   // navigateByUrl()
    ```

    template:

    ```html
    <a [routerLink]="['/products', product.id]">{{product.productName}}</a>
    <a [routerLink]="['/products', product.id, 'edit']">Edit</a>
    <a [routerLink]="['/products', 0, 'edit']">Add Product</a>
    <a routerLink="/products/0/edit">Add Product</a>
    ```

    ```diff
    + import { Router } from '@angular/router'; ...

    @Component({...})
    export class AppComponent {

      constructor(private router: Router) { }

      logOut(): void {
        // Do some processing
    +    this.router.navigate(['/welcome']);
      }
    }
    ```

### Reading Route Parameters

**Observable** and **Snapshot** are 2 ways to read parameters using **ActivatedRoute** service.

**ActivatedRoute Service**:

* Url segments
* Route parameters
* Query parameters
* Resolver data

#### Snapshot -- read parameters only once

We're on ProductList page. When we click the Product Name link, we will navigate to ProductDetail page.

_Angular Module_:

```javascript
{ path: 'products/:id', component: ProductDetailComponent }
```

_Template_:

```html
<a [routerLink]="['/products', product.id]">{{product.productName}}</a>
```

_Component Class_:

```ts
constructor(private route: ActivatedRoute) {
  // Snapshot for initial parameter value
  let id = this.route.snapshot.paramMap.get('id');
}
```

#### Observable -- watch parameter changes

In ProductDetail page, if we click the "Edit" button, the url changes, we need watch this change and navigate to ProductEdit page.

_Angular Module_:

```javascript
{ path: 'products/:id/edit', component: ProductEditComponent }
```

_Template_:

```html
<a [routerLink]="['/products', product.id, 'edit']">Edit</a>
```

_Component Class_:

```ts
constructor(private route: ActivatedRoute) {
  // Observable if parameter changes later
  this.route.paramMap.subscribe(
    params => {
      let id = params.get('id');
    }
  );
}
```

### Required and Optional Parameters

_Required_:

```html
[routerLink]="['/products', productName, productCode, availabilityStart, availabilityEnd]"
<!-- http://localhost:3000/products/apple/gmg/March%201%2C%202015/March%201%2C%202017 -->
```

```javascript
// Module:
{ path: 'products/:name/:code/:startDate/:endDate', component: ProductListComponent }
```

_Optional_: **Frequently used for search criteria to filter data**

```html
[routerLink]="['/products', {name: productName, code: productCode, startDate: availabilityStart, endDate: availabilityEnd}]"
<!-- http://localhost:3000/products;name=apple;code=gmg;startDate=March%201%2C%202015;endDate=March%201%2C%202017 -->
```

```javascript
// Module:
{ path: 'products', component: ProductListComponent }
```

#### Reading Optional Route Parameters

```ts
import { ActivatedRoute } from '@angular/router';

constructor(private route: ActivatedRoute) {
  console.log(this.route.snapshot.paramMap('name'));
  console.log(this.route.snapshot.paramMap('code'));
}
```

### Query Parameter

<http://localhost:3000/products/5?filterBy=er&showImage=true>

_Template_:

```html
<a [routerLink] = "['/products', product.id]"
  [queryParams] = "{ filterBy: 'er', showImage: true }">
  {{product.productName}}
</a>
```

_Component_:

```ts
this.router.navigate(['/products'],
  {
    queryParams: { filterBy: 'er', showImage: true }
  }
);
```

_Angular Module_:

```ts
{ path: 'products', component: ProductListComponent }
```

#### Retaining Query Parameter

```html
<a [routerLink] = "['/products']"
  queryParamsHandling = "preserve">
  Back
</a>
```

```ts
this.router.navigate(['/products'],
  { queryParamsHandling: 'preserve' }
);
```

#### Reading Query Parameter

```ts
import { ActivatedRoute } from '@angular/router';

constructor(private route: ActivatedRoute) {
  console.log(this.route.snapshot.queryParams['filterBy']);
  console.log(this.route.snapshot.queryParams['showImage']);
}
```

```html
<a [routerLink] = "['/products', product.id]"
  [queryParams] = "{ filterBy: listFilter, showImage: showImage }">
  {{product.productName}}
</a>
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
