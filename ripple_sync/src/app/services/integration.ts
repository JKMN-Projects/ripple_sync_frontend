import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface IntegrationReponseDto {
  data: Array<IntegrationDto>;
}

export interface IntegrationDto {
  platformId: number;
  name: string;
  description: string;
  connected: boolean;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class Integration {

  private integrationsSignal = signal<IntegrationDto[] | null>(null);
  readonly integrations = this.integrationsSignal.asReadonly();

  constructor(private http: HttpClient) { }

  /// Retrieves all integrations from the API
  getIntegrations() {
    if (true) {
      const integrationsShell = [
        {
          platformId: 1,
          name: "Twitter",
          description: "Share updates on Twitter",
          connected: true,
          imageUrl: ''
        },
        {
          platformId: 2,
          name: "Facebook",
          description: "Create posts on Facebook",
          connected: false,
          imageUrl: ''
        },
        {
          platformId: 3,
          name: "LinkedIn",
          description: "Share professional updates on LinkedIn",
          connected: true,
          imageUrl: ''
        },
        {
          platformId: 4,
          name: "Instagram",
          description: "Post photos and stories on Instagram",
          connected: true,
          imageUrl: ''
        }
      ];

      this.integrationsSignal.set(integrationsShell ?? []);

      return;
    }
    else {
      this.http.get<IntegrationReponseDto>(`${environment.apiUrl}/integrations`, { observe: 'response' })
        .pipe(
          tap({
            next: response => {
              if (response.status === 200) {
                console.log(response.body);
                console.log(response.body?.data);
                
                this.integrationsSignal.set(response.body?.data ?? []);
                console.log(this.integrations);
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
  }

  connectIntegration(platformId:number, accessToken:string) {
    interface ConnectIntegrationReq {
      platformId: number;
      accessToken: string;
    }

    let connectReq:ConnectIntegrationReq = {
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
