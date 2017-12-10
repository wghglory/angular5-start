# Dynamically Duplicate Input Elements

1. Define the input element(s) to duplicate
1. Define a FormGroup, if needed
1. Refactor to make copies
1. Create a FormArray
1. Loop through the FormArray
1. Duplicate the input  element(s)

## Benefits of a FormGroup

* Match the value of the form model to the data model
* Check touched, dirty, and valid state
* Watch for changes and react
* Perform cross field validation
* Dynamically duplicate the group

## Creating a FormGroup in a Method

```ts
buildAddress(): FormGroup {
  return this.fb.group({
    addressType: 'home',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: ''
  });
}

this.customerForm = this.fb.group({
  // ...
  addresses: this.buildAddress()
});
```

## Creating a FormArray

```ts
this.myArray = new FormArray([...]);
this.myArray = this.fb.array([...]);
```

### Looping Through a FormArray

```html
<div formArrayName="addresses" *ngFor="let address of addresses.controls; let i=index">
  <div [formGroupName]="i">
    ...
  </div>
</div>
```

### Duplicate the Input Elements

```ts
addAddress(): void {
  this.addresses.push(this.buildAddress());
}
```

```html
<button class="btn btn-primary" type="button" (click)="addAddress()">
    Add Another Address
</button>
```