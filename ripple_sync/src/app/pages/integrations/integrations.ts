import { Component, effect, inject, Inject, OnInit, signal } from '@angular/core';
import { GenericIntegration } from '../../components/generic-integration/generic-integration';
import { Integration, IntegrationDto } from '../../services/integration';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [GenericIntegration],
  templateUrl: './integrations.html',
  styleUrl: './integrations.scss'
})
export class Integrations implements OnInit {
  integrationService = inject(Integration);
  integrations = this.integrationService.integrations;

  ngOnInit(): void {
    this.integrationService.getIntegrations();
  }
}
