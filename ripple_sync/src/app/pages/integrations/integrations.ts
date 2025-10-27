import { Component, OnInit } from '@angular/core';
import { GenericIntegration } from '../../components/generic-integration/generic-integration';
import { Integration, IntegrationConnection } from '../../services/integration';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [GenericIntegration],
  templateUrl: './integrations.html',
  styleUrl: './integrations.scss'
})
export class Integrations implements OnInit {
  connections: IntegrationConnection[] = [];

  constructor(private integrationService: Integration) {}

  ngOnInit(): void {
    this.loadIntegrations();
  }

  private loadIntegrations(): void {
    this.integrationService.getIntegrations().subscribe({
      next: (integrations) => {
        this.connections = integrations;
      },
      error: (error) => {
        console.error('Failed to load integrations:', error);
      }
    });
  }
}
