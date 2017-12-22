import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { CustomerTemplateDrivenComponent } from './customer-template-drive/customer-template-drive.component';
import { CustomerReactiveComponent } from './customer-reactive/customer-reactive.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    // order matters
    RouterModule.forRoot(
      [
        { path: 'welcome', component: WelcomeComponent },
        { path: 'customer-template-driven', component: CustomerTemplateDrivenComponent },
        { path: 'customer-reactive', component: CustomerReactiveComponent },
        { path: '', redirectTo: 'welcome', pathMatch: 'full' },
        { path: '**', component: PageNotFoundComponent },
      ],
      { enableTracing: true },
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
