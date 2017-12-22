# Grouping and Component-less Routes

* Better organization
* Share resolvers and guards
* Lazy loading

## Grouping

Product.module.ts before:

```ts
RouterModule.forChild([
  {
    path: 'products',
    component: ProductListComponent,
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    resolve: { product: ProductResolver },
  },
  {
    path: 'products/:id/edit',
    component: ProductEditComponent,
    resolve: { product: ProductResolver },
    children: [
      //...
    ],
  },
]);
```

Product.module.ts after:

```ts
RouterModule.forChild([
  {
    path: 'products',
    component: ProductListComponent,
    children: [
      {
        path: ':id',
        component: ProductDetailComponent,
        resolve: { product: ProductResolver },
      },
      {
        path: ':id/edit',
        component: ProductEditComponent,
        resolve: { product: ProductResolver },
        children: [
          //...
        ],
      },
    ],
  },
]);
```

* Define routes as children of one parent route
* Specify relative paths
* But grouping alone is not sufficient!

## Grouping and Component-less Route

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
        children: [
          //...
        ],
      },
    ],
  },
]);
```

* Add a default path that routes to the desired component
* Remove the component from the parent route
* The child routes are displayed in a higher-level outlet

> Grouping and component-less will affect `route.url[x].path`. Debug and see x = 0 or 1, etc

```ts
import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, Router } from '@angular/router';

import { ProductEditComponent } from './product-edit/product-edit.component';

@Injectable()
export class ProductDetailGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // note url[x] is dependent on how route is configured !!!
    const id = +route.url[0].path;
    if (isNaN(id) || id < 1) {
      alert('Invalid product Id');
      this._router.navigate(['/products']);
      return false;
    }
    return true;
  }
}

@Injectable()
export class ProductEditGuard implements CanDeactivate<ProductEditComponent> {
  canDeactivate(component: ProductEditComponent): boolean {
    if (component.productForm.dirty) {
      const productName = component.productForm.get('productName').value || 'New Product';
      return confirm(`Navigate away and lose all changes to ${productName}?`);
    }
    return true;
  }
}
```