import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
          },
          error: (error) => {
            console.error('Failed to load integrations:', error);
            this.integrationsSignal.set([]);
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

  getUserIntegrations() {
    this.http.get<ConnectedIntegrationsResponseDto>(`${environment.apiUrl}/integrations/user`, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 200) {
              this.userIntegrationsSignal.set(response.body?.data ?? []);
            }
          },
          error: (error) => {
            console.error('Failed to load integrations:', error);
            this.userIntegrationsSignal.set([]);
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

  connectIntegration(platformId: number, accessToken: string) {
    interface ConnectIntegrationReq {
      platformId: number;
      accessToken: string;
    }

    let connectReq: ConnectIntegrationReq = {
      platformId,
      accessToken
    }

    this.http.post(`${environment.apiUrl}/integrations`, connectReq, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 201) {
              this.getIntegrations();
            }
          },
          error: (error) => {
            console.error('Failed to connect integration:', error);
          }
        })
        ,
        catchError(err => {
          console.error('Error connecting integration', err);
          return of([]);
        }),
      )
      .subscribe();
  }

  disconnectIntegration(platformId: number) {
    this.http.delete(`${environment.apiUrl}/integrations/${platformId}`, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 204) {
              this.getIntegrations();
            }
          },
          error: (error) => {
            console.error('Failed to disconnect integration:', error);
          }
        })
        ,
        catchError(err => {
          console.error('Error disconnecting integration', err);
          return of([]);
        }),
      )
      .subscribe();
  }
}
