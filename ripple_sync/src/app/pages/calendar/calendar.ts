import { Component, computed, inject, OnInit, signal, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { PostService } from '../../services/post.service';
import { PostDto } from '../../interfaces/postDto';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateTime } from 'luxon';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import { UpsertPost } from '../../components/upsert-post/upsert-post';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    OverlayModule,
    PortalModule,
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit {
  @ViewChild('tooltipTemplate') tooltipTemplate!: TemplateRef<any>;

  private overlayRef?: import('@angular/cdk/overlay').OverlayRef;
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private postService = inject(PostService);
  private dialog = inject(MatDialog);

  today = new Date();
  currentMonth = signal(this.today.getMonth());
  currentYear = signal(this.today.getFullYear());

  get scheduledPosts() {
    return this.postService.posts.value()?.filter(p => p.timestampUnix > 0) || new Array<PostDto>();
  }

  daysInMonth = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const start = new Date(firstDayOfMonth);
    const dayOfWeek = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - dayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }

    return days;
  });

  displayedMonth = computed(() => {
    return new Date(this.currentYear(), this.currentMonth(), 1);
  });

  ngOnInit(): void {
    this.postService.getPostsByUser();
  }

  changeMonth(offset: number) {
    const newMonth = this.currentMonth() + offset;
    const newDate = new Date(this.currentYear(), newMonth);
    this.currentYear.set(newDate.getFullYear());
    this.currentMonth.set(newDate.getMonth());
  }

  postsForDate(date: Date) {
    return this.scheduledPosts.filter(
      p =>
        new Date(p.timestampUnix).getFullYear() === date.getFullYear() &&
        new Date(p.timestampUnix).getMonth() === date.getMonth() &&
        new Date(p.timestampUnix).getDate() === date.getDate()
    );
  }

  getTimeOfDay(post: PostDto) {
    return DateTime.fromMillis(post.timestampUnix).toFormat('HH:mm');
  }

  isToday(date: Date): boolean {
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  getTooltipContent(date: Date): string {
    const posts = this.postsForDate(date);
    if (posts.length <= 1) return '';

    let temp = posts
      .map(p =>
        `${this.getTimeOfDay(p)} • ${p.platforms.join(', ')}\n${this.truncateMessage(p.messageContent)}`
      )
      .join('\n\n');

    return temp;
  }

  isCurrentMonth(date: Date): boolean {
    return (
      date.getFullYear() === this.currentYear() &&
      date.getMonth() === this.currentMonth()
    );
  }

  truncateMessage(message: string | undefined, limit = 30): string {
    if (!message) return '';
    return message.length > limit ? message.slice(0, limit).trimEnd() + '…' : message;
  }

  showTooltip(origin: EventTarget | null, date: Date) {
    if (!origin || !(origin instanceof HTMLElement)) return;

    const tooltipText = this.getTooltipContent(date);
    if (!tooltipText) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      panelClass: 'custom-tooltip-panel',
    });

    const portal = new TemplatePortal(this.tooltipTemplate, this.viewContainerRef, {
      $implicit: tooltipText,
    });

    this.overlayRef.attach(portal);
  }

  hideTooltip() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  openUpsertPostModal(date: Date): void {
    let post: PostDto = {
      postId: "",
      mediaIds: [],
      messageContent: "",
      platforms: [],
      statusName: "",
      timestampUnix: DateTime.fromJSDate(date).toMillis()
    }

    this.dialog.open(UpsertPost, {
      disableClose: true,
      maxHeight: '90vh',
      panelClass: 'login-dialog-panel',
      data: post
    });
  }
}
