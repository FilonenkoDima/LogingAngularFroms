import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { of } from 'rxjs';

function isEqual(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;

    if (val1 === val2) {
      return null;
    }

    return { valuesNotEqual: true };
  };
}

const asyncRequiredValidator: AsyncValidatorFn = (control) => {
  const isValid = !!control.value;
  return of(isValid ? null : { required: true });
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.minLength(8)],
          asyncValidators: [asyncRequiredValidator],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(8)],
          asyncValidators: [asyncRequiredValidator],
        }),
      },
      {
        validators: [isEqual('password', 'confirmPassword')],
      }
    ),
    firstName: new FormControl('', { validators: [Validators.required] }),
    lastName: new FormControl('', { validators: [Validators.required] }),
    address: new FormGroup({
      street: new FormControl('', { validators: [Validators.required] }),
      number: new FormControl('', { validators: [Validators.required] }),
      postalCode: new FormControl('', { validators: [Validators.required] }),
      city: new FormControl('', { validators: [Validators.required] }),
    }),
    role: new FormControl<
      'student' | 'teacher' | 'employee' | 'founder' | 'other'
    >('student', { validators: [Validators.required] }),
    source: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),
    agree: new FormControl(false, { validators: [Validators.required] }),
  });

  get formIsInvalid() {
    return this.form.touched && this.form.dirty && this.form.invalid;
  }

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.passwords.controls.password.touched &&
      this.form.controls.passwords.controls.password.dirty &&
      this.form.controls.passwords.controls.password.invalid
    );
  }

  onReset() {
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID FORM');
      return;
    }
    console.log(this.form);
  }
}
