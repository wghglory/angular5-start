import { AuthGuard } from './../user/auth-guard.service';
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
import { ProductEditTagsComponent } from './product-edit/product-edit-tags.component';
import { ProductEditInfoComponent } from './product-edit/product-edit-info.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'products',
        canActivate: [ AuthGuard ],
        children: [
          {
            path: '',
            component: ProductListComponent,
          },
          {
            path: ':id',
            canActivate: [ ProductDetailGuard ],
            component: ProductDetailComponent,
            resolve: { product: ProductResolver },
          },
          {
            path: ':id/edit',
            canDeactivate: [ ProductEditGuard ],
            component: ProductEditComponent,
            resolve: { product: ProductResolver },
            children: [
              {
                path: '',
                redirectTo: 'info',
                pathMatch: 'full',
              },
              {
                path: 'info',
                component: ProductEditInfoComponent,
              },
              {
                path: 'tags',
                component: ProductEditTagsComponent,
              },
            ],
          },
        ],
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
    ProductEditInfoComponent,
    ProductEditTagsComponent,
    ConvertToSpacesPipe,
  ],
  providers: [ ProductService, ProductDetailGuard, ProductEditGuard, ProductResolver ],
})
export class ProductModule {}
