import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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
  
  private integrations = signal<IntegrationConnection[]>([]);

  constructor(private http: HttpClient) { }

  /// Retrieves all integrations from the API
  getIntegrations(): Observable<IntegrationConnection[]> {
    const integrationsShell = [
      {
        id:1,
        name:"Twitter",
        connected:true
      },
      {
        id:2,
        name:"Facebook",
        connected:false
      },
      {
        id:3,
        name:"LinkedIn",
        connected:true
      },
      {
        id:4,
        name:"Instagram",
        connected:true
      }
    ];

    const integrations = integrationsShell.map(dto => this.mapToIntegrationConnection(dto)) ?? [];

    const obsIntegrations = new BehaviorSubject(integrations).asObservable();
    return obsIntegrations;


    return this.http.get<IntegrationDto[]>(
      `${environment.apiUrl}/integration`,
      { observe: 'response' }
    ).pipe(
      tap({
        next: response => {
          if (response.status === 200) {
            const integrations = response.body?.map(dto => this.mapToIntegrationConnection(dto)) ?? [];
            this.integrations.set(integrations);
          }
        },
        error: (error) => {
          console.error('Failed to load integrations:', error);
          this.integrations.set([]);
        }
      }),
      map(response => response.body?.map(dto => this.mapToIntegrationConnection(dto)) ?? [])
    );
  }

  /// Connects to an integration provider
  connect(id: number): Observable<boolean> {
    return this.http.post<void>(
      `${environment.apiUrl}/integration/${id}/connect`,
      {},
      { observe: 'response' }
    ).pipe(
      tap({
        next: response => {
          if (response.status === 200) {
            this.updateIntegrationStatus(id, true);
          }
        },
        error: (error) => {
          console.error(`Failed to connect integration ${id}:`, error);
        }
      }),
      map(response => response.status === 200)
    );
  }

  /// Disconnects from an integration provider
  disconnect(id: number): Observable<boolean> {
    return this.http.post<void>(
      `${environment.apiUrl}/integration/${id}/disconnect`,
      {},
      { observe: 'response' }
    ).pipe(
      tap({
        next: response => {
          if (response.status === 200) {
            this.updateIntegrationStatus(id, false);
          }
        },
        error: (error) => {
          console.error(`Failed to disconnect integration ${id}:`, error);
        }
      }),
      map(response => response.status === 200)
    );
  }

  private updateIntegrationStatus(id: number, connected: boolean): void {
    const current = this.integrations();
    const updated = current.map(integration => 
      integration.id === id 
        ? { ...integration, connected } 
        : integration
    );
    this.integrations.set(updated);
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
