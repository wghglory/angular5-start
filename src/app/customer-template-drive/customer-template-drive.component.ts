// template-drive form

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Customer } from './customer-template-drive';

@Component({
  templateUrl: './customer-template-drive.component.html',
  styleUrls: ['./customer-template-drive.component.css']
})
export class CustomerTemplateDrivenComponent implements OnInit {
  constructor() {}

  customer = new Customer();

  save(customerForm: NgForm) {
    console.log(customerForm.form);
    console.log('Saved: ' + JSON.stringify(customerForm.value));
  }

  ngOnInit() {}
}
