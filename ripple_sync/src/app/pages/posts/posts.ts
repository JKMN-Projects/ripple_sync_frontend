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
  private dialog = inject(MatDialog)
  private postsService = inject(PostService);
  private subscriptions = new Subscription();
  posts = this.postsService.posts;

  filterControl = new FormControl(this.postsService.filterChangeSignal());

  ngOnInit(): void {
    this.postsService.getPostsByUser();
    this.subscriptions.add(
      this.filterControl.valueChanges.subscribe((value) => {
          this.postsService.filterChangeSignal.set(value)
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  openUpsertPostModal(): void {
    this.dialog.open(UpsertPost, {
      disableClose: true,
      maxHeight: '90vh',
      panelClass: 'login-dialog-panel',
      data: null
    });
  }
}
