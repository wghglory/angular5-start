# Prefetching Data

* Prevent display of a partial page
  * Without a Route Resolver: `/products/5` --> Router --> ComponentHtml --> Calling service to get data. So we will see an "empty"(no data returned yet) page.
  * With Route Resolver: `/products/5` --> Router + Data --> ComponentHtml
* reuse code
* improve flow when an error occurs

## Providing data with a route

### Route's Data Property (seldom use I feel)

_Module_:

```diff
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'products',
        component: ProductListComponent,
+       data: { pageTitle: 'Product List' }
      },
      { path: 'products/:id', component: ProductDetailComponent },
      { path: 'products/:id/edit', component: ProductEditComponent }
    ])
  ]
});
```

_Component_:

```ts
this.pageTitle = this.route.snapshot.data['pageTitle'];
```

### Using a Route Resolver (Important!)

#### Building a Route Resolver Service

```ts
import { Observable } from 'rxjs/Observable';
import { ProductService } from './product.service';
import { IProduct } from './product';
import { Injectable } from '@angular/core';

import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable()
export class ProductResolver implements Resolve<IProduct> {
  constructor (private productService: ProductService, private router: Router) {}

  resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProduct> {
    const id = Number(route.paramMap.get('id'));

    if (isNaN(id)) {
      console.log(`Product id was not a number: ${id}`);
      this.router.navigate(['/products']);
      return Observable.of(null);
    }

    return this.productService
      .getProduct(id)
      .map((product) => {
        if (product) {
          return product;
        }
        console.log(`Product was not found: ${id}`);
        this.router.navigateByUrl('/products');
        return null;
      })
      .catch((err) => {
        console.log(`error: ${err}`);
        this.router.navigateByUrl('/products');
        return Observable.of(null);
      });
  }
}
```

#### Adding a Resolver to a Route Configuration

Module:

```diff
RouterModule.forChild([
  { path: 'products', component: ProductListComponent },
  {
    path: 'products/:id',
    canActivate: [ProductDetailGuard],
    component: ProductDetailComponent,
+    resolve: { product: ProductResolver },
  },
  {
    path: 'products/:id/edit',
    canDeactivate: [ProductEditGuard],
    component: ProductEditComponent,
+    resolve: { product: ProductResolver, categories: CategoryResolver },
  },
]),
providers: [ProductService, ProductDetailGuard, ProductEditGuard,
+  ProductResolver],
```

#### Reading Resolver Data -- Snapshot

_ProductDetail component_:

```ts
import { ActivatedRoute } from '@angular/router';

product: IProduct;

constructor(private route: ActivatedRoute) {
  this.product = this.route.snapshot.data['product'];
}
```

> Snapshot shares the data instance

Component 1 and Component 2 both have below code: They refer the same instance

```ts
this.product = this.route.snapshot.data['product'];
```

#### Reading Resolver Data -- Observable

_ProductEdit component_:

```ts
import { ActivatedRoute } from '@angular/router';

product: IProduct;

constructor(private route: ActivatedRoute) {
  this.route.data.subscribe(
    data => this.product = data['product'];
  );
}
```