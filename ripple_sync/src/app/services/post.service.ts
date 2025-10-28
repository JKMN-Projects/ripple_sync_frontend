import { Injectable, signal } from '@angular/core';
import { Post } from '../interfaces/post';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts = signal<Post[]>([])
  GetPosts(): Observable<Post[]> {
    const posts: Post[] = [
      {
        id: 1,
        messageContent: 'My first post!',
        statusName: 'published',
        mediaAttachment: [],
        timestamp: 1761571800000,
        platforms: ['twitter', 'facebook', 'linkedin'],
      },
      {
        id: 2,
        messageContent: 'Announcement: More Info Soon',
        statusName: 'scheduled',
        mediaAttachment: [''],
        timestamp: 1761571800000,
        platforms: ['instagram', 'facebook'],
      },
      {
        id: 3,
        messageContent: 'Drafted posts that i dont know what the caption should be',
        statusName: 'draft',
        mediaAttachment: [''],
        timestamp: 1761571800000,
        platforms: ['linkedin', 'twitter'],
      },
    ];
    const postsBehavior = new BehaviorSubject(posts).asObservable()
    return postsBehavior
  }
}
