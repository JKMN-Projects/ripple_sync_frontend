import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isOpen = signal(false);

  toggle(): void {
    this.isOpen.update(open => !open);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
