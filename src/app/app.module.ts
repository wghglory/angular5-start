import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { CustomerTemplateDrivenComponent } from './customer-template-drive/customer-template-drive.component';
import { CustomerReactiveComponent } from './customer-reactive/customer-reactive.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

/* app routing module */
import { AppRoutingModule } from './app-routing.module';

/* feature modules */
// import { ProductModule } from './products/product.module';  // to lazy load
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ProductData } from './products/product-data';

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

    // order matters, must after RouterModule.forRoot
    // ProductModule,  to lazy load, so move data here below
    InMemoryWebApiModule.forRoot(ProductData, { delay: 1000 }),
    UserModule,
    MessageModule,
    // must at last
    AppRoutingModule,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {}
