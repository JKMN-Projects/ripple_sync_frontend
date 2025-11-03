import { inject, Injectable, signal } from '@angular/core';
import {  PostDto, PostsByUserResponseDto } from '../interfaces/postDto';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  getPostsByUser( filter?: null | string ) {
      let params = new HttpParams();
    if (filter) {
      params = params.set('status', filter);
    }
    this.http
      .get<PostsByUserResponseDto>(`${environment.apiUrl}/posts/byUser`, { observe: 'response', params })
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

  createPost(messageContent: string, files: File[], timestamp: number | null, integrationIds: number[]) {
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
          next: response => {
            if (response.status === 201) {
              this.getPostsByUser();
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
