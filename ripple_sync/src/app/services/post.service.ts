import { HttpClient, HttpParams, HttpResponseBase } from '@angular/common/http';
import { PostDto, PostsByUserResponseDto } from '../interfaces/postDto';
import { inject, Injectable, resource, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, of, tap } from 'rxjs';

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

  createPost(messageContent: string, files: File[], timestamp: number | null, integrationIds: string[]) {
    const formData = new FormData();
    formData.append("MessageContent", messageContent);
    formData.append("Timestamp", timestamp != null ? timestamp.toString() : "");

    integrationIds.forEach(id => {
      formData.append("IntegrationIds", id.toString());
    })

    files.forEach(file => {
      formData.append("Files", file, file.name);
    })

    this.http.post(environment.apiUrl + "/posts", formData, { observe: 'response' })
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
          alert("Error while deleting post")
          return of(null);
        })
      )
      .subscribe();
  }
}
