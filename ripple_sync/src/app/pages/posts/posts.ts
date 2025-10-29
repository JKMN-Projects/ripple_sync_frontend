import { Component, inject, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAnchor, MatButton } from "@angular/material/button";
import { PostDto } from '../../interfaces/postDto';
import { PostService } from '../../services/post.service';
import { GenericPost } from "../../components/generic-post/generic-post";

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [MatButton, MatGridListModule, MatAnchor, GenericPost],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
})
export class Posts implements OnInit {
  postsService = inject(PostService);
  posts = this.postsService.posts;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPostsByUser();
  }
}
