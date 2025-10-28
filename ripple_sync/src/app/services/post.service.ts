import { Injectable, signal } from '@angular/core';
import { Post } from '../interfaces/post';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreatePostDto } from '../interfaces/create-post-dto';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts = signal<Post[]>([])

  constructor(private http: HttpClient) { }

  GetPosts(): Observable<Post[]> {
    const posts: Post[] = [
      {
        id: 1,
        messageContent: 'My first post!',
        statusName: 'published',
        mediaAttachment: [
        ],
        timestamp: 1698345600000,
        platforms: ['twitter', 'facebook', 'linkedin'],
      },
      {
        id: 2,
        messageContent: 'Announcement: More Info Soon',
        statusName: 'scheduled',
        mediaAttachment: [''],
        timestamp: 1698432000000,
        platforms: ['instagram', 'facebook'],
      },
      {
        id: 3,
        messageContent: 'Drafted posts that i dont know what the caption should be',
        statusName: 'draft',
        mediaAttachment: [""],
        timestamp: 1698518400000,
        platforms: ['linkedin', 'twitter'],
      },
    ];
    const postsBehavior = new BehaviorSubject(posts).asObservable()
    return postsBehavior
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
