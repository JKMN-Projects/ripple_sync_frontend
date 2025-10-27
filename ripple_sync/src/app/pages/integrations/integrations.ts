import { Component, effect, OnInit } from '@angular/core';
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

  constructor(private integrationService: Integration) {
    effect(() => {
      const integrations = this.integrationService.integrations();
      if (integrations) {
        this.connections = integrations;
      }
    });
  }

  ngOnInit(): void {
    this.integrationService.getIntegrations();
  }
}
