import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostService } from '../../services/post.service';
import { PostDto } from '../../interfaces/postDto';
import { Stack } from "../stack/stack";
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-generic-post',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    DatePipe,
    Stack,
    MatDividerModule,
  ],
  templateUrl: './generic-post.html',
  styleUrl: './generic-post.scss',
})
export class GenericPost {
  constructor() {}
  post = input.required<PostDto>();

  postService = inject(PostService);

  isLoading = signal(false);
}
