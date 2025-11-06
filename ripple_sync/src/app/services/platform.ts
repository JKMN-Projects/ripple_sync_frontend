import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Platform } from '../interfaces/platform';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';

interface ListResponse {
  data: Array<Platform>;
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private http = inject(HttpClient);

  private platformsSignal = signal<Platform[] | null>(null);
  readonly platforms = this.platformsSignal.asReadonly();

  getPlatforms() {
    this.http.get<ListResponse>(environment.apiUrl + "/platforms", { observe: 'response' }).pipe(tap(
      {
        next: (response => {
          if (response.ok) {
            console.log(response.body);

            this.platformsSignal.set(response.body?.data ?? []);
          }
        }),
        error: (error) => {
          console.error('Failed to load platforms:', error);
        }
      }
    )).subscribe();
  }
}
