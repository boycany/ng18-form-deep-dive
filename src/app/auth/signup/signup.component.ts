import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

type Role = 'student' | 'teacher' | 'employee' | 'founder' | 'other';

/** Make code more generic!! */
function equalValues(controlName1: string, controlName2: string): ValidatorFn {
  return (constrol: AbstractControl): ValidationErrors | null => {
    const value1 = constrol.get(controlName1)?.value;
    const value2 = constrol.get(controlName2)?.value;
    return value1 !== value2 ? { valuesNotEqual: true } : null;
  };
}

function atLeastOneChecked(control: AbstractControl): ValidationErrors | null {
  // console.log('control :>> ', control);
  if (control.value.some((v: boolean) => v === true)) {
    return null;
  }
  return { atLeastOneChecked: true };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, JsonPipe],
  standalone: true,
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
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        validators: [equalValues('password', 'confirmPassword')],
      },
    ),
    firstName: new FormControl('', {
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
    }),
    address: new FormGroup({
      street: new FormControl('', {
        validators: [Validators.required],
      }),
      number: new FormControl('', {
        validators: [Validators.required],
      }),
      postalCode: new FormControl('', {
        validators: [Validators.required],
      }),
      city: new FormControl('', {
        validators: [Validators.required],
      }),
    }),
    role: new FormControl<Role>('student', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    source: new FormArray(
      [new FormControl(false), new FormControl(false), new FormControl(false)],
      {
        validators: [atLeastOneChecked],
      },
    ),
    agree: new FormControl(false, {
      validators: [Validators.requiredTrue],
      //users should agree to the terms and conditions
    }),
  });

  get email() {
    return this.form.get('email');
  }

  get passwords() {
    return this.form.get('passwords');
  }

  get password() {
    return this.passwords?.get('password');
  }

  get confirmPassword() {
    return this.passwords?.get('confirmPassword');
  }

  onSubmit() {
    if (this.form.invalid) {
      console.log('INVALID');
      console.log('this.form :>> ', this.form);
      return;
    }
    console.log(this.form);
  }

  onReset() {
    this.form.reset();
  }
}
