import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): {[key: string]: boolean} | null => {
    if (c.value != null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return {'range': true};
    }
  
    return null;
  }
}

function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl?.pristine || confirmEmailControl?.pristine) {
    return null;
  }

  if (emailControl?.value === confirmEmailControl?.value) {
    return null;
  }

  return {'match': true};
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm!: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, {validator: emailMatcher}),
      phone: [''],
      notification: ['email'],
      rating: [null, ratingRange(2, 9)],
      sendCatalog: true
    });
  }

  save() {
    console.log(this.customer);
    console.log('Savedddd: ' + JSON.stringify(this.customerForm?.value));
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: 'Long',
      lastName: 'Ho',
      // email: 'long@gmail.com',
      sendCatalog: false
    });
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');

    if (notifyVia === 'text') {
      phoneControl?.setValidators(Validators.required);
    } else {
      phoneControl?.clearValidators();
    }

    phoneControl?.updateValueAndValidity();
  }
}
