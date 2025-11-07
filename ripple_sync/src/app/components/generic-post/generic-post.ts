import { Component, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostService } from '../../services/post.service';
import { MatDividerModule } from '@angular/material/divider';
import { PostDto } from '../../interfaces/postDto';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { UpsertPost } from '../upsert-post/upsert-post';
import { GenericConfirmation } from '../../interfaces/generic-confirmation';
import { GenericConfirmationModal } from '../generic-confirmation-modal/generic-confirmation-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-generic-post',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatDividerModule,
  ],
  templateUrl: './generic-post.html',
  styleUrl: './generic-post.scss',
})
export class GenericPost implements OnDestroy {
  url = environment.apiUrl + "/posts/";
  post = input.required<PostDto>();

  postService = inject(PostService);
  dialog = inject(MatDialog);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private subscriptions = new Subscription();

  isEditable(status: string): boolean {
    const editableStatus = ['draft', 'scheduled'];
    return !editableStatus.includes(status.toLowerCase());
  }

  isDeletable(status: string): boolean {
    const deletableStatus = ['draft', 'scheduled', 'failed'];
    return !deletableStatus.includes(status.toLowerCase());
  }

  isRetryable(status: string): boolean {
    const retryableStatus = ['failed'];
    return !retryableStatus.includes(status.toLowerCase());
  }

  openUpsertPostModal(post: PostDto): void {
    this.dialog.open(UpsertPost, {
      disableClose: false,
      maxHeight: '90vh',
      panelClass: 'login-dialog-panel',
      data: post
    });
  }

  openConfirmationDialog(post: PostDto) {
    const confirmationContent: GenericConfirmation = {
      content: "Are you sure you want to delete this post? This will only delete the post in RippleSync, not on external social media platforms."
    }

    const confirmationDialog = this.dialog.open(GenericConfirmationModal, {
      data: confirmationContent
    })

    this.subscriptions.add(confirmationDialog.afterClosed().subscribe(result => {
      if (result != undefined && result != null && result == true) {
        this.postService.deletePost(post.postId);
      }
    }))
  }

  retryPost(post: PostDto): void {
    this.postService.retryPost(post.postId);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
