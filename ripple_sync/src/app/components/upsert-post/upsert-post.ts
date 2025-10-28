import { Component, inject } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-upsert-post',
  imports: [],
  templateUrl: './upsert-post.html',
  styleUrl: './upsert-post.scss',
})
export class UpsertPost {
  postService = inject(PostService);


}
