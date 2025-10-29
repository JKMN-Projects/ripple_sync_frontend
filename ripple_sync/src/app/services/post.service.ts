import { inject, Injectable, signal } from '@angular/core';
import {  PostDto, PostsByUserResponseDto } from '../interfaces/postDto';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreatePostDto } from '../interfaces/create-post-dto';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postsSignal = signal<PostDto[] | null>(null);
  http = inject(HttpClient);
  readonly posts = this.postsSignal.asReadonly();

  /// Retrieves all integrations from the API
  getPostsByUser() {
    this.http
      .get<PostsByUserResponseDto>(`${environment.apiUrl}/posts/byUser`, { observe: 'response' })
      .pipe(
        tap({
          next: (response) => {
            if (response.status === 200) {
              this.postsSignal.set(response.body?.data ?? []);
            }
          },
          error: (error) => {
            console.error('Failed to load integrations:', error);
            this.postsSignal.set([]);
          },
        }),
        catchError((err) => {
          console.error('Error fetching integrations', err);
          return of([]);
        })
      )
      .subscribe();
  }

  createPost(post: CreatePostDto) {
    this.http.post<CreatePostDto>(environment.apiUrl, post, { observe: 'response' })
      .pipe(
        tap({
          next: response => {
            if (response.status === 201) {
              this.GetPosts();
            }
          },
        }),
        catchError(err => {
          console.error('Error creating user', err);
          return of(null);
        })
      )
      .subscribe();
  }
}
