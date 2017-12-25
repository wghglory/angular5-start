// reactive form

import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
} from '@angular/forms';

import { Customer } from './customer-reactive';

import 'rxjs/add/operator/debounceTime';

/* validator */
function emailMatcher (c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');
  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }
  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { match: true }; // validation fail
}

function ratingRange (min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { range: true }; // validation fail
    }
    return null;
  };
}

@Component({
  templateUrl: './customer-reactive.component.html',
  styleUrls: [ './customer-reactive.component.css' ],
})
export class CustomerReactiveComponent implements OnInit {
  constructor (private fb: FormBuilder) {}

  get addresses (): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  emailMessage: string;

  private validationMessages = {
    required: 'Please enter your email address.',
    pattern: 'Please enter a valid email address.',
    minlength: 'Please enter at least 4 characters.',
  };

  customerForm: FormGroup;

  customer = new Customer();

  save () {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData (): void {
    // partially fill fields
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Harkness',
      sendCatalog: false,
    });

    // // must fill all fields
    // this.customerForm.setValue({
    //   firstName: 'Jack',
    //   lastName: 'Harkness',
    //   email: 'test@gmail.com',
    //   sendCatalog: false
    // });
  }

  // dynamically handle validation. phoneControl is required when notification via phone.
  setNotification (notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity(); // must called. It's like a commit of previous validators set/clear methods
  }

  setMessage (c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.invalid) {
      this.emailMessage = Object.keys(c.errors)
        .map((key) => this.validationMessages[key])
        .join(' ');
    }
  }

  addAddress (): void {
    this.addresses.push(this.buildAddress());
  }

  buildAddress (): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    });
  }

  ngOnInit () {
    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true)
    // });

    this.customerForm = this.fb.group({
      // each value can be an array: 1st init value for the key/fieldName, 2nd validator arr, 3rd is server-interactive validator
      firstName: [ '', [ Validators.required, Validators.minLength(3) ] ],
      lastName: [
        { value: 'Wang', disabled: true },
        [ Validators.required, Validators.maxLength(50) ],
      ],
      emailGroup: this.fb.group(
        {
          email: [ '', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+') ] ],
          confirmEmail: [ '', Validators.required ],
        },
        { validator: emailMatcher },
      ),
      phone: '',
      notification: 'email',
      rating: [ '', ratingRange(1, 5) ],
      // sendCatalog: [{ value: true, disabled: false }]
      sendCatalog: true,
      addresses: this.fb.array([ this.buildAddress() ]),
    });

    this.customerForm
      .get('notification')
      .valueChanges.subscribe((value) => this.setNotification(value));

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges
      .debounceTime(1000)
      .subscribe((value) => this.setMessage(emailControl));
  }
}
