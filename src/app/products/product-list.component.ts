import { Component, OnInit } from '@angular/core';

import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pageTitle: string = 'Product List';
  imageWidth: number = 50;
  imageMargin: number = 2;
  showImage: boolean = false;
  errorMessage: string;

  // way 1: using ngModel, getter and setter to filter products
  // _listFilter: string;
  // get listFilter(): string {
  //   return this._listFilter;
  // }
  // set listFilter(value: string) {
  //   this._listFilter = value;
  //   this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  // }

  // way 2: use field, ngModel, ngModelChange, function to filter products
  listFilter: string;
  onChange(val: string) {
    this.listFilter = val;
    this.filteredProducts = val ? this.performFilter(val) : this.products;
  }

  filteredProducts: IProduct[];
  products: IProduct[] = [];

  constructor(private _productService: ProductService) {}

  onRatingClicked(message: string): void {
    this.pageTitle = 'Product List: ' + message;
  }

  performFilter(filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter(
      (product: IProduct) => product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  ngOnInit(): void {
    this._productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = this.products;
    }, (error) => (this.errorMessage = <any>error));
  }
}
