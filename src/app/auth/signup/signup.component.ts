import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { map, Observable, of } from 'rxjs';

function asyncIsEqual(value: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.value).pipe(
      map((val) => {
        if (!val || val === value) {
          return null;
        } else {
          return { isNotEqual: true };
        }
      })
    );
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
export class SignupComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    passwords: new FormGroup({
      password: new FormControl('', {
        validators: [Validators.minLength(8)],
        asyncValidators: [asyncRequiredValidator],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
        asyncValidators: [asyncRequiredValidator],
      }),
    }),
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
    agree: new FormControl(false, { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    const passwordControl = this.form.value.passwords?.password!;
    const confirmPasswordControl =
      this.form.controls.passwords?.controls.confirmPassword!;

    confirmPasswordControl.statusChanges.subscribe((status) => {
      if (status === 'VALID' && confirmPasswordControl.touched) {
        confirmPasswordControl.setAsyncValidators(
          asyncIsEqual(passwordControl)
        );
        confirmPasswordControl.updateValueAndValidity({ emitEvent: false });
      }
    });
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
    console.log(this.form);

    this.onReset();
  }
}
