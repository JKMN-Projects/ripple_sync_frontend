import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbar } from './components/top-navbar/top-navbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarService } from './services/sidebar-service';
import { VerticalNavbar } from "./components/vertical-navbar/vertical-navbar";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    TopNavbar,
    MatSidenavModule,
    VerticalNavbar
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ripple_sync');
  private sidebarService = inject(SidebarService);
  
  get isSidebarOpen() :boolean {
    return this.sidebarService.isOpen();
  }
  handleOnDrawerClosed(): void {
    if (this.isSidebarOpen) {
      this.sidebarService.close();
    }
  }
}
