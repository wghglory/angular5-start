// template-drive form

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { Customer } from './customer-reactive';

@Component({
  templateUrl: './customer-reactive.component.html',
  styleUrls: ['./customer-reactive.component.css']
})
export class CustomerReactiveComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  customerForm: FormGroup;

  customer = new Customer();

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(): void {
    // partially fill fields
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Harkness',
      sendCatalog: false
    });

    // // must fill all fields
    // this.customerForm.setValue({
    //   firstName: 'Jack',
    //   lastName: 'Harkness',
    //   email: 'test@gmail.com',
    //   sendCatalog: false
    // });
  }

  ngOnInit() {
    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true)
    // });

    this.customerForm = this.fb.group({
      firstName: '',
      lastName: { value: 'Wang', disabled: true },
      email: '',
      sendCatalog: [{ value: true, disabled: false }]
    });
  }
}
