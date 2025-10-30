import { computed, effect, inject, Injectable, resource, signal } from '@angular/core';
import {  PostDto, PostsByUserResponseDto } from '../interfaces/postDto';
import { BehaviorSubject, catchError, Observable, of, single, tap } from 'rxjs';
import { HttpClient, HttpParams, HttpResponseBase } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreatePostDto } from '../interfaces/create-post-dto';

export interface DeletePostResponseState {
  status: 'success' | 'loading' | 'error' | null;
  message: string | null;
}
interface PostParams{
  statusFilter: string | null
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  public filterChangeSignal = signal<string | null>(null);
  deleteState = signal<DeletePostResponseState>({
    status: null,
    message: null,
  });
  http = inject(HttpClient);

  postsSignal = resource({
    params: () => ({ statusFilter: this.filterChangeSignal() }),
    loader: ({ params }) => this.getPostsByUser(params),
  });

  readonly posts = this.postsSignal.asReadonly();

  /// Retrieves all integrations from the API
  getPostsByUser(filter?: PostParams) : Promise<PostDto[]> {
    return new Promise((resolve, reject) => {
      let params = new HttpParams();
      if (filter?.statusFilter) {
        params = params.set('status', filter.statusFilter);
      }
      this.http
        .get<PostsByUserResponseDto>(`${environment.apiUrl}/posts/byUser`, {
          observe: 'response',
          params,
        })
        .pipe(
          tap({
            next: (response) => {
              if (response.status === 200) {
                resolve(response.body?.data ?? [])
              }
            },
            error: (error) => {
              console.error('Failed to load integrations:', error);
              reject(error);
            },
          }),
          catchError((err) => {
            console.error('Error fetching integrations', err);
            reject([]);
            return [];
          })
        )
        .subscribe();
    });
  }

  createPost(post: CreatePostDto) {
    this.http
      .post<CreatePostDto>(environment.apiUrl, post, { observe: 'response' })
      .pipe(
        tap({
          next: (response) => {
            if (response.status === 201) {
              this.getPostsByUser();
            }
          },
        }),
        catchError((err) => {
          console.error('Error creating user', err);
          return of(null);
        })
      )
      .subscribe();
  }
  deletePost(postId: string) {
    this.http
      .delete<HttpResponseBase>(`${environment.apiUrl}/posts/${encodeURIComponent(postId)}`, {
        observe: 'response',
      })
      .pipe(
        tap({
          next: (response) => {
            if (response.status === 204) {
              this.postsSignal.reload();
            }
          },
        }),
        catchError((err) => {
          console.error('Error deleting post', err);
          return of(null);
        })
      )
      .subscribe();
  }
}
