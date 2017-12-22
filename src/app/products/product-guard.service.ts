import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, Router } from '@angular/router';

import { ProductEditComponent } from './product-edit/product-edit.component';

@Injectable()
export class ProductDetailGuard implements CanActivate {
  constructor (private _router: Router) {}

  canActivate (route: ActivatedRouteSnapshot): boolean {
    // note url[x] is dependent on how route is configured !!!
    const id = +route.url[0].path;
    if (isNaN(id) || id < 1) {
      alert('Invalid product Id');
      this._router.navigate([ '/products' ]);
      return false;
    }
    return true;
  }
}

@Injectable()
export class ProductEditGuard implements CanDeactivate<ProductEditComponent> {
  canDeactivate (component: ProductEditComponent): boolean {
    /* reactive form */
    // if (component.productForm.dirty) {
    //   const productName = component.productForm.get('productName').value || 'New Product';
    //   return confirm(`Navigate away and lose all changes to ${productName}?`);
    // }

    if (component.isDirty) {
      const productName = component.product.productName || 'New Product';
      return confirm(`Navigate away and lose all changes to ${productName}?`);
    }
    return true;
  }
}
