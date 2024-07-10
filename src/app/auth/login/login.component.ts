import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }

  return { noQuestionMark: true };
}

/** Async Validator */
function emailIsUnique(control: AbstractControl) {
  if (control.value !== 'test@example.com') {
    return of(null);
  }
  return of({
    notUnique: true,
  });
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  get emailIsInvalid() {
    return (
      this.form.controls.email.invalid &&
      this.form.controls.email.touched &&
      this.form.controls.email.dirty
    );
  }

  get passwordIsInvalid() {
    return (
      this.form.controls.password.invalid &&
      this.form.controls.password.touched &&
      this.form.controls.password.dirty
    );
  }

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsUnique],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  ngOnInit(): void {
    const savedForm = sessionStorage.getItem('saved-login-form');
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      this.form.patchValue({
        email: parsedForm.email,
      });
    }

    const formSubscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          console.log('value :>> ', value);
          sessionStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email }),
          );
        },
      });

    this.destroyRef.onDestroy(() => {
      formSubscription.unsubscribe();
    });
  }

  onSubmit() {
    console.log(this.form.value);

    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
  }
}
