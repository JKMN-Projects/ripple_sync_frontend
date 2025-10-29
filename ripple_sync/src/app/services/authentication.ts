import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
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

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${environment.apiUrl}/authentication/login`,
      credentials,
      { observe: 'response' }
    ).pipe(
      tap({
        next: response => {
          if (response.status === 200) {
            console.log(response.body);
            this.userEmail.set(response.body?.email ?? '');
            this.isAuthenticated.set(true);
            localStorage.setItem("expiresAt", response.body?.expiresAt.toString() ?? "")
          }
        },
        error: () => {
          this.isAuthenticated.set(false);
        }
      }),
      map(response => response.body as AuthenticationResponse)
    );
  }

  checkExpiresAt() {
    const expiresAt = Number.parseInt(localStorage.getItem("expiresAt") ?? "0");

    if (new Date().getTime() < expiresAt) {
      this.isAuthenticated.set(true);
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
