import { Component, inject } from '@angular/core';
import { MatDivider } from "@angular/material/divider";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { IconContainer } from "../icon-container/icon-container";
import { MatIcon } from "@angular/material/icon";
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-vertical-navbar',
  imports: [
    MatDivider,
    MatButtonModule,
    RouterLink,
    IconContainer,
    RouterLinkActive,
    MatIcon
],
  templateUrl: './vertical-navbar.html',
  styleUrl: './vertical-navbar.scss',
})
export class VerticalNavbar {
  private authenticationService = inject(Authentication);

  get userEmail(): string | null {
    return this.authenticationService.userEmail();
  }

  logout(): void {
    this.authenticationService.logout();
  } 
} 
