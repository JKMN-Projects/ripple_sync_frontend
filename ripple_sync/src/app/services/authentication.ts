import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { parseProblemDetails, ProblemDetails } from '../interfaces/problemDetails';

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

export interface AuthenticationTokenResponse {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  isAuthenticated = signal<boolean>(false);
  userEmail = signal<string>("");
  registerState = signal<RegisterResponseState>({ status: null, message: null, validationErrors: null });

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthenticationTokenResponse> {
    return this.http.post<AuthenticationTokenResponse>(
      `${environment.apiUrl}/authentication/login`,
      credentials,
      { observe: 'response' }
    ).pipe(
      tap({
        next: response => {
          if (response.ok) {
            this.userEmail.set(response.body?.email ?? '');
            this.isAuthenticated.set(true);
          }
        },
        error: () => {
          this.isAuthenticated.set(false);
        }
      }),
      map(response => response.body as AuthenticationTokenResponse)
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
            this.registerState.update(state => ({ ...state, status: 'success', message: null, validationErrors: null }) );
          }
        },
        error: (error) => {
          console.error('Registration error:', error, error.error);
          const problemDetails = parseProblemDetails(error.error);
          console.log('Parsed ProblemDetails:', problemDetails);
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

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
