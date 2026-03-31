import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(Auth);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      try {
        await this.authService.login(username!, password!);
      } catch (error) {
        // TODO: Handle login errors (e.g., incorrect credentials)
        console.error('Login failed', error);
      }
    }
  }
}
