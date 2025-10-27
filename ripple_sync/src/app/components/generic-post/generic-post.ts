import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostService } from '../../services/post.service';
import { Post } from '../../interfaces/post';
import { Stack } from "../stack/stack";
@Component({
  selector: 'app-generic-post',
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatProgressSpinnerModule, DatePipe, Stack],
  templateUrl: './generic-post.html',
  styleUrl: './generic-post.scss',
})
export class GenericPost {
  constructor(private postService: PostService){}
  post = input.required<Post>();

 
}
