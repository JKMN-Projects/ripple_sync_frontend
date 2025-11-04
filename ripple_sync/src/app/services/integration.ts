import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface IntegrationResponseDto {
  data: Array<IntegrationDto>;
}

export interface IntegrationDto {
  platformId: number;
  name: string;
  description: string;
  connected: boolean;
  imageUrl: string;
}

export interface ConnectedIntegrationsResponseDto {
  data: Array<ConnectedIntegrationDto>;
}

export interface ConnectedIntegrationDto {
  userPlatformIntegrationId: string;
  platFormName: string;
}

@Injectable({
  providedIn: 'root'
})
export class Integration {
  private integrationsSignal = signal<IntegrationDto[] | null>(null);
  readonly integrations = this.integrationsSignal.asReadonly();

  private userIntegrationsSignal = signal<ConnectedIntegrationDto[] | null>(null);
  readonly userIntegrations = this.userIntegrationsSignal.asReadonly();

  http = inject(HttpClient)

  /// Retrieves all integrations from the API
  getIntegrations() {
    this.http.get<IntegrationResponseDto>(`${environment.apiUrl}/integrations`, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 200) {
              this.integrationsSignal.set(response.body?.data ?? []);
            }
          }
        }),
        catchError(err => {
          console.error('Error fetching integrations', err);
          return of([]);
        }),
      )
      .subscribe();
  }

  getUserIntegrations() {
    this.http.get<ConnectedIntegrationsResponseDto>(`${environment.apiUrl}/integrations/user`, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 200) {
              this.userIntegrationsSignal.set(response.body?.data ?? []);
            }
          }
        })
        ,
        catchError(err => {
          console.error('Error fetching integrations', err);
          return of([]);
        }),
      )
      .subscribe();
  }

  connect(platformId: number) {
    this.http.get<{redirectUrl:string}>(`${environment.apiUrl}/oauth/initiate/${platformId}`, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 200 && response.body?.redirectUrl != undefined) {
              window.location.href = response.body?.redirectUrl;
            }
          }
        }),
        catchError(err => {
          console.error('Error connecting integration', err);
          return of([]);
        }),
      )
      .subscribe();
  }

  disconnect(platformId: number) {
    this.http.delete(`${environment.apiUrl}/integrations/${platformId}`, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 204) {
              this.getIntegrations();
            }
          }
        }),
        catchError(err => {
          console.error('Error disconnecting integration', err);
          return of([]);
        }),
      )
      .subscribe();
  }
}
