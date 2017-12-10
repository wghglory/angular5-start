import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IProduct } from './product';

@Injectable()
export class ProductService {
  // private baseUrl = './api/products/products.json';
  private baseUrl = 'api/products';

  constructor(private _http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return (
      this._http
        .get<IProduct[]>(this.baseUrl)
        // .do(data => console.log('All: ' + JSON.stringify(data)))
        .catch(this.handleError)
    );
  }

  getProduct(id: number): Observable<IProduct> {
    return this.getProducts().map((products: IProduct[]) => products.find((p) => p.id === id));
  }

  deleteProduct(id: number): Observable<Response> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const url = `${this.baseUrl}/${id}`;
    return this._http
      .delete(url, { headers: headers })
      .do((data) => console.log('deleteProduct: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  saveProduct(product: IProduct): Observable<IProduct> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (product.id === 0) {
      return this.createProduct(product, { headers: headers });
    }
    return this.updateProduct(product, { headers: headers });
  }

  private createProduct(product: IProduct, options: any): Observable<IProduct> {
    product.id = undefined;
    return this._http
      .post(this.baseUrl, product, options)
      .map(this.extractData)
      .do((data) => console.log('createProduct: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private updateProduct(product: IProduct, options: any): Observable<IProduct> {
    const url = `${this.baseUrl}/${product.id}`;
    return this._http
      .put(url, product, options)
      .map(() => product)
      .do((data) => console.log('updateProduct: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  private extractData(response: any) {
    console.log(response);
    let body = response.json();
    console.log(body);
    return body.data || {};
  }

  initializeProduct(): IProduct {
    // Return an initialized object
    return {
      id: 0,
      productName: null,
      productCode: null,
      tags: [''],
      releaseDate: null,
      price: null,
      description: null,
      starRating: null,
      imageUrl: null
    };
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}
