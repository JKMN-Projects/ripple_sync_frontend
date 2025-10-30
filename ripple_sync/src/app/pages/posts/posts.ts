import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAnchor, MatButton } from "@angular/material/button";
import { PostService } from '../../services/post.service';
import { GenericPost } from "../../components/generic-post/generic-post";
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';import { MatDialog } from '@angular/material/dialog';
import { UpsertPost } from '../../components/upsert-post/upsert-post';
import { PostDto } from '../../interfaces/postDto';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [MatButton, MatGridListModule, MatAnchor, GenericPost, MatButtonToggleModule, FormsModule, ReactiveFormsModule],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
})
export class Posts implements OnInit {
  dialog = inject(MatDialog)
  postsService = inject(PostService);
  posts = this.postsService.posts;
  private subscriptions = new Subscription();

  filterControl = new FormControl(null);

  ngOnInit(): void {
    this.postsService.getPostsByUser();
    this.subscriptions.add(
      this.filterControl.valueChanges.subscribe((value) => {
          this.postsService.getPostsByUser(value);
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
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
