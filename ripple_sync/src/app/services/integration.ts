import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface IntegrationDto {
  id: number;
  name: string;
  connected: boolean;
}

export interface IntegrationConnection extends IntegrationDto {
  description: string;
  iconUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Integration {

  private integrationsSignal = signal<IntegrationConnection[] | null>(null);
  readonly integrations = this.integrationsSignal.asReadonly();

  constructor(private http: HttpClient) { }

  /// Retrieves all integrations from the API
  getIntegrations() {
    const integrationsShell = [
      {
        id: 1,
        name: "Twitter",
        connected: true
      },
      {
        id: 2,
        name: "Facebook",
        connected: false
      },
      {
        id: 3,
        name: "LinkedIn",
        connected: true
      },
      {
        id: 4,
        name: "Instagram",
        connected: true
      }
    ];

    this.integrationsSignal.set(integrationsShell.map(dto => this.mapToIntegrationConnection(dto)) ?? []);

    return;

    this.http.get<IntegrationDto[]>(`${environment.apiUrl}/integration`, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 200) {
              const integrations = response.body?.map(dto => this.mapToIntegrationConnection(dto)) ?? [];
              this.integrationsSignal.set(integrations);
            }
          },
          error: (error) => {
            console.error('Failed to load integrations:', error);
            this.integrationsSignal.set([]);
          }
        })
        ,
        catchError(err => {
          console.error('Error fetching users', err);
          return of([]);
        }),
      )
      .subscribe();
  }

  private mapToIntegrationConnection(dto: IntegrationDto): IntegrationConnection {
    const descriptionMap: Record<string, string> = {
      'Twitter': 'Share updates on Twitter.',
      'Facebook': 'Create posts on Facebook.',
      'LinkedIn': 'Share professional updates on LinkedIn.',
      'Instagram': 'Post photos and stories on Instagram.'
    };

    return {
      ...dto,
      description: descriptionMap[dto.name] ?? `Connect to ${dto.name}.`,
      iconUrl: undefined
    };
  }
}
