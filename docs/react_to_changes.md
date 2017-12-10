# React to changes

## Watching (`subscribe valueChanges`)

* valueChanges property emits events on value changes
* valueChanges is an `Observable<any>`
* Observable is a collection of events that arrive asynchronously over time
* Subscribe to the observable to watch the events
* statusChanges property emits events on validation changes

```ts
this.myFormControl.valueChanges.subscribe(value =>
   console.log(value));

this.myFormGroup.valueChanges.subscribe(value =>
   console.log(JSON.stringify(value)));

this.customerForm.valueChanges.subscribe(value =>
   console.log(JSON.stringify(value)));
```

## Reacting

* Validation rules
* Validation messages
* User interface elements
* Automatic suggestions
* And more ...

```ts
this.myFormControl.valueChanges
    .subscribe(value => this.setNotification(value));
```

## Reactive Transformations

```ts
// Add the operator
import 'rxjs/add/operator/debounceTime';

// Use the operator
this.myFormControl.valueChanges
                  .debounceTime(1000)
                  .subscribe(value => console.log(value));
```

### debounceTime

* Ignores events until a specific time has passed without another event
* debounceTime(1000) waits for 1000 milliseconds (1 sec) of no events before emitting another event

### throttleTime

Emits a value, then ignores subsequent values for a specific amount of time

### distinctUntilChanged

Suppresses duplicate consecutive items

## Simplify validation code by subscribing valueChanges

Old html:

```html
<div class="form-group" [ngClass]="{'has-error': (customerForm.controls.emailGroup.controls.email.touched ||
                                                customerForm.get('emailGroup.email').dirty) &&
                                                customerForm.get('emailGroup.email').invalid }">
  <label class="col-md-2 control-label" for="emailId">Email</label>

  <div class="col-md-8">
    <input formControlName="email" class="form-control" id="emailId" type="email" placeholder="Email (required)"/>
    <span class="help-block" *ngIf="(customerForm.get('emailGroup.email').touched ||
                                                  customerForm.get('emailGroup.email').dirty) &&
                                                  customerForm.get('emailGroup.email').invalid">
      <span *ngIf="customerForm.get('emailGroup.email').errors.required">
        Please enter your email address.
      </span>
      <span *ngIf="customerForm.get('emailGroup.email').errors.pattern">
        Please enter a valid email address.
      </span>

      <span *ngIf="customerForm.get('emailGroup.email').errors.email">
        Please enter a valid email address.
      </span>
    </span>
  </div>
</div>
```

New html:

```html
<div class="form-group" [ngClass]="{'has-error': emailMessage }">
  <label class="col-md-2 control-label" for="emailId">Email</label>

  <div class="col-md-8">
    <input class="form-control" id="emailId" type="email" placeholder="Email (required)"
      formControlName="email" />
    <span class="help-block" *ngIf="emailMessage">
      {{ emailMessage }}
    </span>
  </div>
</div>
```

```diff
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';

import { Customer } from './customer-reactive';

+ import 'rxjs/add/operator/debounceTime';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  let emailControl = c.get('email');
  let confirmControl = c.get('confirmEmail');
  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }
  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { match: true }; // validation fail
}

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { range: true }; // validation fail
    }
    return null;
  };
}

//...
export class CustomerReactiveComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

+  emailMessage: string;

+  private validationMessages = {
+    required: 'Please enter your email address.',
+    pattern: 'Please enter a valid email address.',
+    minlength: 'Please enter at least 4 characters.'
+  };

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

  // dynamically handle validation. phoneControl is required when notification via phone.
  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'phone') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity(); // must called. It's like a commit of previous validators set/clear methods
  }

+  setMessage(c: AbstractControl): void {
+    this.emailMessage = '';
+    if ((c.touched || c.dirty) && c.invalid) {
+      this.emailMessage = Object.keys(c.errors)
+        .map((key) => this.validationMessages[key])
+        .join(' ');
+    }
+  }

  ngOnInit() {
    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true)
    // });

    this.customerForm = this.fb.group({
      // each value can be an array: 1st init value for the key/fieldName, 2nd validator arr, 3rd is server-interactive validator
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: [
        { value: 'Wang', disabled: true },
        [Validators.required, Validators.maxLength(50)]
      ],
      emailGroup: this.fb.group(
        {
          email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
          confirmEmail: ['', Validators.required]
        },
        { validator: emailMatcher }
      ),
      phone: '',
      notification: 'email',
      rating: ['', ratingRange(1, 5)],
      // sendCatalog: [{ value: true, disabled: false }]
      sendCatalog: true
    });

+    const emailControl = this.customerForm.get('emailGroup.email');
+    emailControl.valueChanges
+      .debounceTime(1000)
+      .subscribe((value) => this.setMessage(emailControl));
  }
}
```