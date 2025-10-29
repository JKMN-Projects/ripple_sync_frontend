import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbar } from './components/top-navbar/top-navbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarService } from './services/sidebar-service';
import { VerticalNavbar } from "./components/vertical-navbar/vertical-navbar";
import { CommonModule } from '@angular/common';
import { Authentication } from './services/authentication';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopNavbar,
    MatSidenavModule,
    VerticalNavbar,
    CommonModule,
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('ripple_sync');
  private sidebarService = inject(SidebarService);
  authService = inject(Authentication);

  get isSidebarOpen() :boolean {
    return this.sidebarService.isOpen();
  }
  handleOnDrawerClosed(): void {
    if (this.isSidebarOpen) {
      this.sidebarService.close();
    }
  }

  ngOnInit(): void {
    this.authService.checkExpiresAt();
  }
}
