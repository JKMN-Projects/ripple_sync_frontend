import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { IconContainer } from "../../components/icon-container/icon-container";
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Authentication } from '../../services/authentication';
import { LoginModal } from '../../components/login-modal/login-modal';
import { PlatformService } from '../../services/platform';

@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    MatGridListModule,
    MatCardModule,
    IconContainer
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private authService = inject(Authentication);
  private platformService = inject(PlatformService);

  get platforms() {
    return this.platformService.platforms;
  }

  ngOnInit(): void {
    this.platformService.getPlatforms();
  }

  openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginModal, {
      disableClose: false,
      maxHeight: '90vh',
      panelClass: 'dialog-panel--no-scroll',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/posts']);
      }
    })
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
