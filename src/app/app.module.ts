import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { ProductModule } from './products/product.module';
import { CustomerTemplateDrivenComponent } from './customer-template-drive/customer-template-drive.component';
import { CustomerReactiveComponent } from './customer-reactive/customer-reactive.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    CustomerTemplateDrivenComponent,
    CustomerReactiveComponent
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
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
    ]),
    // order matters
    ProductModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
