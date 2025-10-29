import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAnchor, MatButton } from "@angular/material/button";
import { PostDto } from '../../interfaces/postDto';
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
  posts: PostDto[] = [];
  dialog = inject(MatDialog)

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getPostsByUser();
  }

  openUpsertPostModal(post: PostDto | null, isEdit: boolean): void {
    this.dialog.open(UpsertPost, {
      disableClose: false,
      maxHeight: '90vh',
      panelClass: 'login-dialog-panel',
      data: isEdit ? post : null
    });
  }
}
