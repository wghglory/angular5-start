import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { CustomerTemplateDrivenComponent } from './customer-template-drive/customer-template-drive.component';
import { CustomerReactiveComponent } from './customer-reactive/customer-reactive.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { AuthGuard } from './user/auth-guard.service';
import { SelectiveStrategy } from './selective-strategy.service';

@NgModule({
  imports: [
    // order matters
    RouterModule.forRoot(
      [
        { path: 'welcome', component: WelcomeComponent },
        // lazy loading product module
        {
          path: 'products',
          canActivate: [ AuthGuard ],
          data: { preload: true },
          loadChildren: './products/product.module#ProductModule',
        },
        { path: 'customer-template-driven', component: CustomerTemplateDrivenComponent },
        { path: 'customer-reactive', component: CustomerReactiveComponent },
        { path: '', redirectTo: 'welcome', pathMatch: 'full' },
        { path: '**', component: PageNotFoundComponent },
      ],
      {
        enableTracing: false,
        preloadingStrategy: SelectiveStrategy,
      },
    ),
  ],
  providers: [ SelectiveStrategy ],
  exports: [ RouterModule ],
})
export class AppRoutingModule {}
