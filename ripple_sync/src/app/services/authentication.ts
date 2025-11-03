import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { parseProblemDetails, ProblemDetails } from '../interfaces/problemDetails';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
export interface RegisterResponseState {
  status: 'success' | 'loading' | 'error' | null;
  message: string | null;
  validationErrors: Record<string, string[]> | null;
}

export interface AuthenticationResponse {
  email: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  router = inject(Router);

  isAuthenticated = signal<boolean>(false);
  userEmail = signal<string>("");
  registerState = signal<RegisterResponseState>({ status: null, message: null, validationErrors: null });

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${environment.apiUrl}/authentication/login`,
      credentials,
      { observe: 'response' }
    ).pipe(
      tap({
        next: response => {
          if (response.ok) {
            this.userEmail.set(response.body?.email ?? '');
            this.isAuthenticated.set(true);
            localStorage.setItem("expiresAt", response.body?.expiresAt.toString() ?? "");
            localStorage.setItem("email", response.body?.email.toString() ?? "");
          }
        },
        error: () => {
          this.isAuthenticated.set(false);
        }
      }),
      map(response => response.body as AuthenticationResponse)
    );
  }

  register(register: RegisterRequest): void {
    this.registerState.set({ status: 'loading', message: null, validationErrors: null });
    this.http.post<ProblemDetails>(
      `${environment.apiUrl}/authentication/register`,
      register,
      { observe: 'response' }
    ).pipe(
      tap({
        next: response => {
          if (response.ok) {
            this.registerState.update(state => ({ ...state, status: 'success', message: null, validationErrors: null }));
          }
        },
        error: (error) => {
          const problemDetails = parseProblemDetails(error.error);
          if (error.status === 400 && problemDetails?.validationErrors) {
            this.registerState.update(state => ({ ...state, status: 'error', message: 'Some fields have validation errors', validationErrors: problemDetails.validationErrors || null }));
          }
          else if (error.status >= 400 && error.status < 500 && problemDetails) {
            this.registerState.update(state => ({ ...state, status: 'error', message: 'An error occurred. ' + problemDetails.detail }));
          }
          else {
            this.registerState.update(state => ({ ...state, status: 'error', message: 'An unexpected error occurred. Please try again later.' }));
          }
        }
      })
    ).subscribe();
  }
  checkExpiresAt() {
    const expiresAt = Number.parseInt(localStorage.getItem("expiresAt") ?? "0");

    if (new Date().getTime() < expiresAt) {
      this.isAuthenticated.set(true);
      this.userEmail.set(localStorage.getItem("email") ?? "");
      this.router.navigate(["/posts"]);
    }
    else {
      // Call refresh token endpoint and move this.logout to that method.
      this.logout();
    }
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.router.navigate(["/"]);
  }
}
