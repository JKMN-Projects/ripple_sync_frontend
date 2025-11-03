import { Component, effect, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostService } from '../../services/post.service';
import { MatDividerModule } from '@angular/material/divider';
import { PostDto } from '../../interfaces/postDto';
import { environment } from '../../../environments/environment';

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
export class GenericPost {
  url = environment.apiUrl + "/posts/";
  post = input.required<PostDto>();

  postService = inject(PostService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  DeletePost() {
    this.postService.deletePost(this.post().postId)
  }
  isEditable(status: string): boolean {
    const editableStatus = ['draft', 'scheduled'];
    return !editableStatus.includes(status.toLowerCase());
  }

  isDeletable(status: string): boolean {
    const deletableStatus = ['draft', 'scheduled'];
    return !deletableStatus.includes(status.toLowerCase());
  }

  isRetryable(status: string): boolean {
    const retryableStatus = ['failed'];
    return !retryableStatus.includes(status.toLowerCase());
  }
}
