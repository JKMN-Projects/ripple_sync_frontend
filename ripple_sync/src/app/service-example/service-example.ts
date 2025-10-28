import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userListSignal = signal<User[] | null>(null);
  readonly userList = this.userListSignal.asReadonly();

  constructor(private http: HttpClient) { }

  getUsers() {
    this.http.get<User[]>(environment.apiUrl, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 200) {
              this.userListSignal.set(response.body);
            }
          },
        }),
        catchError(err => {
          console.error('Error fetching users', err);
          return of([]);
        }),
      )
      .subscribe();
    // .subscribe() er nødvendig for at execute requesten. Hvis subscribe ikke kaldes kan der i steder bruges return,
    // og så er det komponenten der kalder som dikterer hvornår service metoden eksekveres.
  }

  createUser(user: User) {
    this.http.post<User>(environment.apiUrl, user, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 201) {
              this.getUsers();
            }
          },
        }),
        catchError(err => {
          console.error('Error creating user', err);
          return of(null);
        })
      )
      .subscribe();
    // .subscribe() er nødvendig for at execute requesten. Hvis subscribe ikke kaldes kan der i steder bruges return,
    // og så er det komponenten der kalder som dikterer hvornår service metoden eksekveres.
  }
}
