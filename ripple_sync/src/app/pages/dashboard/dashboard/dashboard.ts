import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { IconContainer } from "../../../components/icon-container/icon-container";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../../services/dashboard-service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatIcon } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    IconContainer,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatIcon,
    MatTooltipModule
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy{
  filterControl = new FormControl('All time');
  private subscriptions = new Subscription();
  private dashboardService = inject(DashboardService);

  get dashboardData() {
    return this.dashboardService.dashboardData;
  }

  ngOnInit(): void {
    this.dashboardService.reloadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
