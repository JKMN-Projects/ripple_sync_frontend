import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Integration, IntegrationConnection } from '../../services/integration';

@Component({
  selector: 'app-generic-integration',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './generic-integration.html',
  styleUrl: './generic-integration.scss'
})
export class GenericIntegration {
  connection = input.required<IntegrationConnection>();
  
  isLoading = false;

  constructor(private integrationService: Integration) {}

  onToggleConnection(): void {
    if (this.isLoading) return;
    
    const currentConnection = this.connection();
    this.isLoading = true;
    
    const action$ = currentConnection.connected
      ? this.integrationService.disconnect(currentConnection.id)
      : this.integrationService.connect(currentConnection.id);

    action$.subscribe({
      next: (success) => {
        if (success) {
          currentConnection.connected = !currentConnection.connected;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Connection toggle failed:', error);
        this.isLoading = false;
      }
    });
  }
}