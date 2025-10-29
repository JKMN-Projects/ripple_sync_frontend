import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Authentication } from '../../services/authentication';
import { LoginModal } from '../login-modal/login-modal';
import { SidebarService } from '../../services/sidebar-service';

@Component({
  selector: 'app-top-navbar',
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule
],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.scss',
})
export class TopNavbar {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  authService = inject(Authentication);
  private sidebarService = inject(SidebarService);

  openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginModal, {
      disableClose: false,
      maxHeight: '90vh',
      panelClass: 'dialog-panel--no-scroll',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/']); // Change route when post list component is implemented
      }
    })
  }

  toggleDrawer(): void {
    this.sidebarService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
