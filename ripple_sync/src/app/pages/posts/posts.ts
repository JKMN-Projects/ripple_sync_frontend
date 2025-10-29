import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAnchor, MatButton } from "@angular/material/button";
import { Post } from '../../interfaces/post';
import { PostService } from '../../services/post.service';
import { GenericPost } from "../../components/generic-post/generic-post";
import { Stack } from "../../components/stack/stack";
import { MatDialog } from '@angular/material/dialog';
import { UpsertPost } from '../../components/upsert-post/upsert-post';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [MatButton, MatGridListModule, MatAnchor, GenericPost, Stack],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
})
export class Posts implements OnInit {
  private dialog = inject(MatDialog);
  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  openUpsertPostModal(post: Post | null, isEdit: boolean): void {
    this.dialog.open(UpsertPost, {
      disableClose: false,
      maxHeight: '90vh',
      panelClass: 'login-dialog-panel',
      data: isEdit ? post : null
    });
  }

  loadPosts(): void {
    this.postService.GetPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
      },
    });
  }
}
