import { Component, inject, OnDestroy } from '@angular/core';
import { MatDivider } from "@angular/material/divider";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { IconContainer } from "../icon-container/icon-container";
import { MatIcon } from "@angular/material/icon";
import { Authentication } from '../../services/authentication';
import { GenericConfirmation } from '../../interfaces/generic-confirmation';
import { MatDialog } from '@angular/material/dialog';
import { GenericConfirmationModal } from '../generic-confirmation-modal/generic-confirmation-modal';
import { Subscription } from 'rxjs';

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
export class VerticalNavbar implements OnDestroy {
  private authenticationService = inject(Authentication);
  private dialog = inject(MatDialog);

  private subscriptions = new Subscription();

  get userEmail(): string | null {
    return this.authenticationService.userEmail();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  deleteAccount() {
    const confirmationContent: GenericConfirmation = {
      content: "Are you sure you want to delete your account?"
    }

    const confirmationDialog = this.dialog.open(GenericConfirmationModal, {
      data: confirmationContent
    })

    this.subscriptions.add(confirmationDialog.afterClosed().subscribe(result => {
      if (result != undefined && result != null && result == true) {
        this.authenticationService.deleteAccount();
      }
    }))
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
