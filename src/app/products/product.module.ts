import { ProductData } from './product-data';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { ConvertToSpacesPipe } from '../shared/convert-to-spaces.pipe';
import { SharedModule } from './../shared/shared.module';

import { ProductDetailGuard, ProductEditGuard } from './product-guard.service';
import { ProductService } from './product.service';

import { ProductResolver } from './product-resolver.service';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'products', component: ProductListComponent },
      {
        path: 'products/:id',
        canActivate: [ProductDetailGuard],
        component: ProductDetailComponent,
        resolve: { product: ProductResolver },
      },
      {
        path: 'products/:id/edit',
        canDeactivate: [ProductEditGuard],
        component: ProductEditComponent,
        resolve: { product: ProductResolver },
      },
    ]),
    SharedModule,
    ReactiveFormsModule,
    HttpClientInMemoryWebApiModule.forRoot(ProductData, { delay: 1000 }), // must after HttpClientModule
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ConvertToSpacesPipe,
  ],
  providers: [ProductService, ProductDetailGuard, ProductEditGuard, ProductResolver],
})
export class ProductModule {}
