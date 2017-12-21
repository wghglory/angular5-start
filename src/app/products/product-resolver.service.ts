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
