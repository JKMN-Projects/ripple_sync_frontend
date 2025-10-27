import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
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

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthenticationTokenResponse> {
    return this.http.post<AuthenticationTokenResponse>(
      `${environment.apiUrl}/authentication/login`,
      credentials,
      { observe: 'response' }
    ).pipe(
      tap({
        next: response => {
          if (response.status === 200) {
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

  logout(): void {
    this.isAuthenticated.set(false);
  }
}
