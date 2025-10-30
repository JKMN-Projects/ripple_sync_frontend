import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { IconContainer } from "../../../components/icon-container/icon-container";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    IconContainer,
    MatButtonToggleModule,
    FormsModule, 
    ReactiveFormsModule
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{
  filterControl = new FormControl('today');
  private subscriptions = new Subscription();
  
  ngOnInit(): void {
    this.subscriptions.add(
      this.filterControl.valueChanges.subscribe((value) => {
        console.log('[Subscription] Filter changed to:', value);
      })
    );
  }
}
