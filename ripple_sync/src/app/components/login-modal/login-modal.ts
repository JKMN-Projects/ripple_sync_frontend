import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Authentication, LoginRequest } from '../../services/authentication';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss',
})
export class LoginModal {
  private fb = inject(FormBuilder);
  private authService = inject(Authentication);
  private dialogRef = inject(MatDialogRef<LoginModal>);

  loginForm = this.fb.group({
    email: [environment.production ? '' : 'jukman@gmail.com', [Validators.required, Validators.email]],
    password: [environment.production ? '' : 'Kode1234!', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  getEmailErrorMessage(): string {
    if (this.emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (this.emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (this.passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const login: LoginRequest = {
        email: this.emailControl?.value ?? "",
        password: this.passwordControl?.value ?? ""
      };

      this.authService.isAuthenticated();

      this.authService.login(login).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(error.error?.message || 'Login failed. Please try again.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
