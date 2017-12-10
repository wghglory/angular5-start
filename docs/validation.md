# Validation thru reactive form

## Creating the Root FormGroup

```ts
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

export class CustomerReactiveComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  customerForm: FormGroup;
  customer = new Customer();

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      sendCatalog: true
    });
  }
}
```

## Creating the FormControls

```ts
ngOnInit(): void {
  this.customerForm = this.fb.group({
    firstName: '',
    sendCatalog: true
  });
}
```

```ts
this.customerForm = this.fb.group({
  firstName: { value: 'n/a', disabled: true },
  sendCatalog: { value: true, disabled: false }
});
```

```ts
this.customerForm = this.fb.group({
  firstName: [''],
  sendCatalog: [true]
});
```

## Setting Built-in Validation Rules

```ts
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class CustomerTemplateDrivenComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  customerForm: FormGroup;

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      sendCatalog: true
    });
  }
}
```

```ts
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export class CustomerTemplateDrivenComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  customerForm: FormGroup;

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      sendCatalog: true
    });
  }
}
```

## Adjusting Validation Rules at Runtime

```ts
myControl.setValidators(Validators.required);
myControl.setValidators([Validators.required, Validators.maxLength(30)]);
myControl.clearValidators();
myControl.updateValueAndValidity();
```

```ts
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
```

## Custom Validators

```ts
import { AbstractControl } from '@angular/forms';

function myCustomValidator(c: AbstractControl): { [key: string]: boolean } | null {
  if (somethingIsWrong) {
    return { myvalidator: true };
  }
  return null;
}
```

## Custom Validators with Parameters

```ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

function myCustomValidator(param: any): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (somethingIsWrong) {
      return { myvalidator: true };
    }
    return null;
  };
}
```

## Cross-field Validation -- Nested Form

```ts
this.customerForm = this.fb.group({
  firstName: ['', [Validators.required, Validators.minLength(3)]],
  lastName: ['', [Validators.required, Validators.maxLength(50)]],
  availability: this.fb.group({
    start: ['', Validators.required],
    end: ['', Validators.required]
  })
});
```

```html
<div formGroupName="availability">
  ...
  <input formControlName="start"/>
  ...
  <input formControlName="end"/>
</div>
```

### Cross-field Validation: Custom Validator

```ts
function dateCompare(c: AbstractControl): { [key: string]: boolean } | null {
  let startControl = c.get('start');
  let endControl = c.get('end');
  if (startControl.value !== endControl.value) {
    return { match: true };
  }
  return null;
}

this.customerForm = this.fb.group({
  firstName: ['', [Validators.required, Validators.minLength(3)]],
  lastName: ['', [Validators.required, Validators.maxLength(50)]],
  availability: this.fb.group(
    {
      start: ['', Validators.required],
      end: ['', Validators.required]
    },
    { validator: dateCompare }
  )
});
```