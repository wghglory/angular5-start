import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { CustomerTemplateDrivenComponent } from './customer-template-drive/customer-template-drive.component';
import { CustomerReactiveComponent } from './customer-reactive/customer-reactive.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

/* feature modules */
import { ProductModule } from './products/product.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    CustomerTemplateDrivenComponent,
    CustomerReactiveComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // template-driven
    ReactiveFormsModule, // reactive
    HttpClientModule,
    // order matters
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      { path: 'customer-template-driven', component: CustomerTemplateDrivenComponent },
      { path: 'customer-reactive', component: CustomerReactiveComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent },
    ]),
    // order matters, must after RouterModule.forRoot
    ProductModule,
    UserModule,
    MessageModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
