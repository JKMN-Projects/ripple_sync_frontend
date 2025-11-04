import { HttpClient, HttpParams, HttpResponseBase } from '@angular/common/http';
import { PostDto, PostsByUserResponseDto } from '../interfaces/postDto';
import { inject, Injectable, resource, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom, forkJoin, map, Observable, of, tap } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface DeletePostResponseState {
  status: 'success' | 'loading' | 'error' | null;
  message: string | null;
}
interface PostParams {
  statusFilter: string | null
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  filterChangeSignal = signal<string | null>(null);
  deleteState = signal<{ status: string | null; message: string | null }>({ status: null, message: null });

  http = inject(HttpClient);
  sanitizer = inject(DomSanitizer);

  postsSignal = resource({
    params: () => ({ statusFilter: this.filterChangeSignal() }),
    loader: ({ params }) => this.getPostsByUser(params),
  });

  readonly posts = this.postsSignal.asReadonly();

  getPostsByUser(filter?: { statusFilter?: string | null }): Promise<PostDto[]> {
    return new Promise((resolve, reject) => {
      let params = new HttpParams();
      if (filter?.statusFilter) params = params.set('status', filter.statusFilter);

      this.http
        .get<PostsByUserResponseDto>(`${environment.apiUrl}/posts/byUser`, {
          observe: 'response',
          params,
        })
        .pipe(
          tap({
            next: (response) => {
              if (response.status === 200) {
                resolve(response.body?.data ?? []);
                this.postsSignal.reload();
              }
            },
            error: (error) => {
              console.error('Failed to load posts:', error);
              reject(error);
            },
          }),
          catchError((err) => {
            console.error('Error fetching posts', err);
            reject([]);
            return [];
          })
        )
        .subscribe();
    });
  }

  createPost(messageContent: string, files: File[], timestamp: number | null, integrationIds: string[]) {
    const formData = this.setFormData(messageContent, files, timestamp, integrationIds);

    this.http.post(environment.apiUrl + "/posts", formData, { observe: 'response' })
      .pipe(
        tap({
          next: (response) => {
            if (response.status === 201) {
              this.postsSignal.reload();
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

  updatePost(postId: string, messageContent: string, files: File[], timestamp: number | null, integrationIds: string[]) {
    const formData = this.setFormData(messageContent, files, timestamp, integrationIds, postId);

    this.http.put(environment.apiUrl + "/posts", formData, { observe: 'response' })
      .pipe(
        tap({
          next: (response) => {
            if (response.status === 201) {
              this.postsSignal.reload();
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

  private setFormData(messageContent: string, files: File[], timestamp: number | null, integrationIds: string[], postId?: string) {
    const formData = new FormData();

    if (postId != undefined) {
      formData.append("PostId", postId);
    }

    formData.append("MessageContent", messageContent);
    formData.append("Timestamp", timestamp != null ? timestamp.toString() : "");

    integrationIds.forEach(id => {
      formData.append("IntegrationIds", id.toString());
    })

    files.forEach(file => {
      formData.append("Files", file, file.name);
    })

    return formData;
  }
}
