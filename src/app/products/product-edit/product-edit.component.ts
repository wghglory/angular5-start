import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormControlName,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IProduct } from '../product';
import { ProductService } from '../product.service';
import { MessageService } from './../../message/message.service';

import { NumberValidators } from '../../shared/validator.number';
import { GenericValidator } from '../../shared/validator.generic';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: [ './product-edit.component.css' ],
})
export class ProductEditComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];

  pageTitle = 'Product Edit';
  errorMessage: string;
  productForm: FormGroup;

  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get tags (): FormArray {
    return <FormArray>this.productForm.get('tags');
  }

  constructor (
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
  ) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      productName: {
        required: 'Product name is required.',
        minlength: 'Product name must be at least three characters.',
        maxlength: 'Product name cannot exceed 50 characters.',
      },
      productCode: {
        required: 'Product code is required.',
      },
      starRating: {
        range: 'Rate the product between 1 (lowest) and 5 (highest).',
      },
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  private dataIsValid: { [key: string]: boolean } = {};
  private currentProduct: IProduct;
  private originalProduct: IProduct;

  get product (): IProduct {
    return this.currentProduct;
  }
  set product (value: IProduct) {
    this.currentProduct = value;
    // Clone the object to retain a copy
    this.originalProduct = Object.assign({}, value);
  }

  get isDirty (): boolean {
    return JSON.stringify(this.originalProduct) !== JSON.stringify(this.currentProduct);
  }

  /* regular, calling service after load. Not using a route resolver
  ngOnInit (): void {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      productCode: ['', Validators.required],
      starRating: ['', NumberValidators.range(1, 5)],
      tags: this.fb.array([]),
      description: '',
    });

    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe((params) => {
      const id = +params.get('id');
      this.getProduct(id);
    });
  }

  ngOnDestroy (): void {
    this.sub.unsubscribe();
  }

  getProduct (id: number): void {
    this.productService
      .getProduct(id)
      .subscribe(
        (product: IProduct) => this.onProductRetrieved(product),
        (error: any) => (this.errorMessage = <any>error),
      );
  }
  */

  ngOnInit (): void {
    this.productForm = this.fb.group({
      productName: [
        '',
        [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ],
      ],
      productCode: [ '', Validators.required ],
      starRating: [ '', NumberValidators.range(1, 5) ],
      tags: this.fb.array([]),
      description: '',
    });

    this.route.data.subscribe((data) => {
      this.onProductRetrieved(data['product']);
    });
  }

  ngAfterViewInit (): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements.map((formControl: ElementRef) =>
      Observable.fromEvent(formControl.nativeElement, 'blur'),
    );

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.productForm.valueChanges, ...controlBlurs)
      .debounceTime(800)
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(this.productForm);
      });
  }

  addTag (): void {
    this.tags.push(new FormControl());
  }

  onProductRetrieved (product: IProduct): void {
    if (this.productForm) {
      this.productForm.reset();
    }
    this.product = product;

    if (this.product.id === 0) {
      this.pageTitle = 'Add Product';
    } else {
      this.pageTitle = `Edit Product: ${this.product.productName}`;
    }

    // Update the data on the form
    this.productForm.patchValue({
      productName: this.product.productName,
      productCode: this.product.productCode,
      starRating: this.product.starRating,
      description: this.product.description,
    });
    this.productForm.setControl('tags', this.fb.array(this.product.tags || []));
  }

  deleteProduct (): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService
          .deleteProduct(this.product.id)
          .subscribe(
            () => this.onSaveComplete(`${this.product.productName} was deleted`),
            (error: any) => (this.errorMessage = <any>error),
          );
      }
    }
  }

  reset (): void {
    this.dataIsValid = null;
    this.currentProduct = null;
    this.originalProduct = null;
  }

  saveProduct (): void {
    // // if using reactive form
    // if (this.productForm.dirty && this.productForm.valid) {
    //   // Copy the form values over the product object values
    //   const p = Object.assign({}, this.product, this.productForm.value);

    //   this.productService
    //     .saveProduct(p)
    //     .subscribe(
    //       () => this.onSaveComplete(`${this.product.productName} was saved`),
    //       (error: any) => (this.errorMessage = <any>error),
    //     );
    // } else if (!this.productForm.dirty) {
    //   this.onSaveComplete();
    // }

    if (this.isValid(null)) {
      this.productService
        .saveProduct(this.product)
        .subscribe(
          () => this.onSaveComplete(`${this.product.productName} was saved`),
          (error: any) => (this.errorMessage = <any>error),
        );
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete (message?: string): void {
    // Reset the form to clear the flags
    this.productForm.reset();
    this.reset();

    if (message) {
      this.messageService.addMessage(message);
    }

    this.router.navigate([ '/products' ]);
  }

  isValid (path: string): boolean {
    this.validate();
    if (path) {
      return this.dataIsValid[path];
    }
    return (
      this.dataIsValid && Object.keys(this.dataIsValid).every((d) => this.dataIsValid[d] === true)
    );
  }

  validate (): void {
    // Clear the validation object
    this.dataIsValid = {};

    // 'info' tab
    if (
      this.product.productName &&
      this.product.productName.length >= 3 &&
      this.product.productCode
    ) {
      this.dataIsValid['info'] = true;
    } else {
      this.dataIsValid['info'] = false;
    }

    // 'tags' tab
    if (this.product.category && this.product.category.length >= 3) {
      this.dataIsValid['tags'] = true;
    } else {
      this.dataIsValid['tags'] = false;
    }
  }
}
