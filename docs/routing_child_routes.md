# Child Routes

![child routes](http://om1o84p1p.bkt.clouddn.com/1513935936.png?imageMogr2/thumbnail/!70p)

## Primary Router Outlet

app.component.html

```html
<div>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <a class="navbar-brand">{{pageTitle}}</a>
      <ul class="nav navbar-nav">
        <li>
          <a [routerLink]="['/welcome']">Home</a>
        </li>
        <li>
          <a [routerLink]="['/products']">Product List</a>
        </li>
        <li>
          <a [routerLink]="['/products', 0, 'edit']">Add Product</a>
        </li>
      </ul>
    </div>
  </nav>
  <div class="container">
    <router-outlet></router-outlet>
  </div>
</div>
```

## Child routes

![](http://om1o84p1p.bkt.clouddn.com/1513936349.png?imageMogr2/thumbnail/!70p)

* Tabbed pages
* Master/detail layouts
* Embedded templates
* Feature modules
* Lazy loading

1. _product.module.ts_:

    ```diff
    {
      path: 'products/:id/edit',
      component: ProductEditComponent,
      resolve: { product: ProductResolver },
    +  children: [
    +    { path: '', redirectTo: 'info', pathMatch: 'full' },
    +    { path: 'info', component: ProductEditInfoComponent },
    +    { path: 'tags', component: ProductEditTagsComponent },
    +  ],
    };
    ```

1. Placing the Child View: _product-edit.component.html_

    ```html
    <div class="panel-body">
      <div class="wizard">
        <a [routerLink]="['info']">
          Basic Information
        </a>
        <a [routerLink]="['tags']">
          Search Tags
        </a>
      </div>
      <router-outlet></router-outlet>
    </div>
    ```

1. Activating Child Routes:

    Template:

    ```html
    <!-- Absolute path -->
    <a [routerLink]="['/products', product.id, 'edit', 'info']">Info</a>

    <!-- Relative path -->
    <a [routerLink]="['info']">Info</a>
    ```

    Component Class:

    ```ts
    // Absolute path
    this.router.navigate(['/products', this.product.id, 'edit', 'info']);

    // Relative path
    this.router.navigate(['info'], { relativeTo: this.route });
    ```

1. Obtaining Data for a Child Route

    Product Data Service:

    ```ts
    this.productService.getProduct(id).subscribe(product => this.product = product);
    ```

    Parent Route Resolver:

    ```ts
    this.product = this.route.snapshot.data['product'];
    ```

    Child Route Resolver: `route.parent` to get data from parent resolver

    ```ts
    import { Component, OnInit, ViewChild } from '@angular/core';
    import { ActivatedRoute } from '@angular/router';

    export class ProductEditInfoComponent implements OnInit {

      constructor (private route: ActivatedRoute) {}

      ngOnInit (): void {
        this.route.parent.data.subscribe((data) => {
          this.product = data['product'];
        });
      }
    }
    ```

1. Validating Across Child Routes

    Define a form in each child component, but perform manual validation in Parent component (ProductEdit).

    ```diff
    + private dataIsValid: { [key: string]: boolean } = {};

    saveProduct (): void {
    +  if (this.isValid(null)) {
        this.productService
          .saveProduct(this.product)
          .subscribe(
            () => this.onSaveComplete(`${this.product.productName} was saved`),
            (error: any) => (this.errorMessage = <any>error),
          );
      } else {
        this.errorMessage = 'Please correct the validation errors.';
      }
    }

    + isValid (path: string): boolean {
    +   this.validate();
    +   if (path) {
    +     return this.dataIsValid[path];
    +   }
    +   return (
    +     this.dataIsValid && Object.keys(this.dataIsValid).every((d) => this.dataIsValid[d] === true)
    +   );
    + }
    +
    + validate (): void {
    +   // Clear the validation object
    +   this.dataIsValid = {};
    +
    +   // 'info' tab
    +   if (
    +     this.product.productName &&
    +     this.product.productName.length >= 3 &&
    +     this.product.productCode
    +   ) {
    +     this.dataIsValid['info'] = true;
    +   } else {
    +     this.dataIsValid['info'] = false;
    +   }
    +
    +   // 'tags' tab
    +   if (this.product.category && this.product.category.length >= 3) {
    +     this.dataIsValid['tags'] = true;
    +   } else {
    +     this.dataIsValid['tags'] = false;
    +   }
    + }
    ```