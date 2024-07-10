import {
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule],
})
export class LoginComponent {
  private form = viewChild<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    console.log('this.form() :>> ', this.form());
    afterNextRender(() => {
      const savedForm = sessionStorage.getItem('saved-login-form');

      if (savedForm) {
        const loadedFormData = JSON.parse(savedForm);

        /** simulate async call because form is not yet initialized */
        setTimeout(() => {
          this.form()?.controls['email'].setValue(loadedFormData.email);
        }, 1);
      }

      /** form and valueChanges might not exist because form is not yet initialized */
      console.log('after next render this.form() :>> ', this.form());
      const formSubscription = this.form()
        ?.valueChanges?.pipe(debounceTime(500))
        .subscribe({
          next: (value) => {
            console.log('value :>> ', value);
            window.sessionStorage.setItem(
              'saved-login-form',
              JSON.stringify({
                email: value.email,
              }),
            );
          },
        });

      this.destroyRef.onDestroy(() => {
        formSubscription?.unsubscribe();
      });
    });
  }

  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      alert('Please enter a valid email and password');
      return;
    }

    console.log('formData :>> ', formData);
    console.log('formData.form :>> ', formData.form);
    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;

    console.log('enteredEmail :>> ', enteredEmail);
    console.log('enteredPassword :>> ', enteredPassword);

    // formData.form.reset();
  }
}
