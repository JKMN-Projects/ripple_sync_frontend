import { AfterViewInit, Component, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Integration, IntegrationDto } from '../../services/integration';
import { StatusChangeEvent } from '@angular/forms';

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
export class GenericIntegration implements AfterViewInit {
  connection = input.required<IntegrationDto>();


  integrationService = inject(Integration)

  isLoading = signal(false);

  ngAfterViewInit(): void {
    console.log("generic");
    console.log(this.connection());
  }

  onToggleConnection(): void {
    if (this.isLoading()) return;
    const currentIntegration = this.connection();
    this.isLoading.set(true);

    if (currentIntegration.connected) {
      this.integrationService.disconnectIntegration(currentIntegration.platformId)
    } else {
      this.integrationService.connectIntegration(currentIntegration.platformId, ":)");
    }

    this.isLoading.set(false);
  }
}