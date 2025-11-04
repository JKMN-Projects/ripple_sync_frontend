import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GenericConfirmation } from '../../interfaces/generic-confirmation';

@Component({
  selector: 'app-generic-confirmation-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './generic-confirmation-modal.html',
  styleUrl: './generic-confirmation-modal.scss',
})
export class GenericConfirmationModal implements OnInit {
  private dialogRef = inject(MatDialogRef<GenericConfirmationModal>);
  private data = inject<GenericConfirmation>(MAT_DIALOG_DATA);

  title = signal<string>("Confirm");
  content = signal<string>("Are you sure you want to do this?");
  yesButton = signal<string>("Yes");
  noButton = signal<string>("No");

  ngOnInit(): void {
    if (this.data != undefined && this.data != null) {
      this.setTitle();
      this.setContent();
      this.setYesButton();
      this.setNoButton();
    }
  }

  setTitle() {
    if (this.data.title != undefined && this.data.title != null && this.data.title != "") {
      this.title.set(this.data.title);
    }
  }

  setContent() {
    if (this.data.content != undefined && this.data.content != null && this.data.content != "") {
      this.content.set(this.data.content);
    }
  }

  setYesButton() {
    if (this.data.yesButton != undefined && this.data.yesButton != null && this.data.yesButton != "") {
      this.yesButton.set(this.data.yesButton);
    }
  }

  setNoButton() {
    if (this.data.noButton != undefined && this.data.noButton != null && this.data.noButton != "") {
      this.noButton.set(this.data.noButton);
    }
  }

  closeModal(action: boolean) {
    this.dialogRef.close(action);
  }
}
