import { Component, effect, inject, Inject, OnInit } from '@angular/core';
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
  integrations: IntegrationDto[] = [];

  integrationService = inject(Integration);

  constructor() {
    effect(() => {
     
      const integrations = this.integrationService.integrations();
      if (integrations) {
        this.integrations = integrations; 
        console.log("intergration site");
        console.log(this.integrations);
      }
    });
  }

  ngOnInit(): void {
    this.integrationService.getIntegrations();
  }
}
