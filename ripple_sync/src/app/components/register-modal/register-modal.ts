import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Authentication, RegisterRequest } from '../../services/authentication';
import { MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { IconContainer } from "../icon-container/icon-container";
import { MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { LoginModal } from '../login-modal/login-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    IconContainer
  ],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.scss',
})
export class RegisterModal {
  private fb = inject(FormBuilder);
  private authService = inject(Authentication);
  private dialogRef = inject(MatDialogRef<RegisterModal>);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), this.passwordMatchValidator.bind(this)]]
  });

  isLoading = computed(() => this.authService.registerState().status === 'loading');
  errorMessage = computed(() => this.authService.registerState().status === 'error' ? this.authService.registerState().message : null);

constructor() {
    effect(() => {
      switch (this.authService.registerState().status) {
        case 'success':
          this.dialogRef.close(true);
          
          const dialogRef = this.dialog.open(LoginModal, {
            disableClose: false,
            maxHeight: '90vh',
            panelClass: 'dialog-panel--no-scroll',
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.router.navigate(['/']); // Change route when post list component is implemented
            }
          })
          break;
        case 'error':
          const validationErrors = this.authService.registerState().validationErrors;
          if (validationErrors) {
            if (validationErrors['email']) {
              this.emailControl?.setErrors({ serverError: validationErrors['email'][0] });
            }
            if (validationErrors['password']) {
              this.passwordControl?.setErrors({ serverError: validationErrors['password'][0] });
            }
          }
          break;
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    if (this.registerForm) {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = control.value;

      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
    }

    return null;
  }
  
  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  getEmailErrorMessage(): string {
    if (this.emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (this.emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (this.emailControl?.hasError('serverError')) {
      return this.emailControl.getError('serverError');
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
    if (this.confirmPasswordControl?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    if (this.passwordControl?.hasError('serverError')) {
      return this.passwordControl.getError('serverError');
    }
    return '';
  }

  register() {
    if (this.registerForm.valid) {
      const register: RegisterRequest = {
        email: this.emailControl?.value ?? "",
        password: this.passwordControl?.value ?? ""
      };

      this.authService.register(register);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
