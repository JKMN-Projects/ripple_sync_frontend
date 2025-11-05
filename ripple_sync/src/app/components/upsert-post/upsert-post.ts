import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PostDto } from '../../interfaces/postDto';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ConnectedIntegrationDto, Integration, IntegrationDto } from '../../services/integration';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { DateTime } from 'luxon';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { formErrorMessage } from '../../utility/form-error-message';
import { AiFloatingChatComponent } from '../ai-floating-chat/ai-floating-chat';

enum TimestampTypes {
  Now = 1,
  Scheduled = 2,
  Draft = 3
}

@Component({
  selector: 'app-upsert-post',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    AiFloatingChatComponent,
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  templateUrl: './upsert-post.html',
  styleUrl: './upsert-post.scss',
})
export class UpsertPost implements OnInit {
  private fb = inject(FormBuilder);
  private data = inject<PostDto>(MAT_DIALOG_DATA);
  private postService = inject(PostService);
  private integrationService = inject(Integration);
  private dialogRef = inject(MatDialogRef<UpsertPost>);

  readonly timestampTypes = TimestampTypes;

  get integrations() {
    return this.integrationService.userIntegrations;
  }
  showDatePicker = signal(false);
  formattedScheduledDate = signal('');
  files = signal<File[]>([]);
  previews = signal<string[]>([]);
  isDragging = signal(false);

  readonly timestampOptions = [
    { label: 'Now', value: TimestampTypes.Now },
    { label: 'Scheduled', value: TimestampTypes.Scheduled },
    { label: 'Draft', value: TimestampTypes.Draft }
  ];

  postFormGroup = this.fb.group({
    message: new FormControl<string | null>(null, [Validators.required, Validators.minLength(1)]),
    media: new FormControl<Array<string> | null>(new Array<string>()),
    platforms: new FormControl<Array<ConnectedIntegrationDto> | null>(null, [Validators.required]),
    timestampType: new FormControl<TimestampTypes | null>(null),
    timestamp: new FormControl<number | null>(null, [Validators.required])
  })

  get messageControl() {
    return this.postFormGroup.get("message");
  }

  get mediaControl() {
    return this.postFormGroup.get("media");
  }

  get platformsControl() {
    return this.postFormGroup.get("platforms");
  }

  get timestampTypeControl() {
    return this.postFormGroup.get("timestampType");
  }

  get timestampControl() {
    return this.postFormGroup.get("timestamp");
  }

  constructor() {
    effect(() => {
      if (this.checkIfEdit() && this.integrations() != null && this.integrations()!.length > 0) {
        this.platformsControl?.setValue(this.integrations()?.filter(item => this.data.platforms.includes(item.platFormName)) ?? null);
      }
    })
  }

  ngOnInit(): void {
    this.integrationService.getUserIntegrations();
    if (this.checkIfEdit()) {
      this.assignFormValues();
    }
  }

  compareIntegrations = (a: ConnectedIntegrationDto, b: ConnectedIntegrationDto) =>
    a && b && a.platFormName === b.platFormName;

  onChipSelect(type: TimestampTypes) {
    this.timestampTypeControl?.setValue(type);

    if (type === TimestampTypes.Now) {
      const now = DateTime.now();
      this.timestampControl?.setValue(now.toMillis());
      this.formattedScheduledDate.set('');
      this.showDatePicker.set(false);
    } else if (type === TimestampTypes.Scheduled) {
      this.showDatePicker.set(true);
      if (!this.timestampControl?.value) {
        const now = DateTime.now();
        this.timestampControl?.setValue(now.toMillis());
        this.formattedScheduledDate.set(now.toFormat('MMM dd, yyyy HH:mm'));
      }
    } else {
      this.timestampControl?.setValue(null);
      this.formattedScheduledDate.set('');
      this.showDatePicker.set(false);
    }
  }

  onDateTimeChange(event: any) {
    const selectedDate = event.value;
    if (selectedDate) {
      const currentTimestamp = this.timestampControl?.value;
      let dateTime = DateTime.fromJSDate(selectedDate);

      if (currentTimestamp) {
        const currentDateTime = DateTime.fromMillis(currentTimestamp);
        dateTime = dateTime.set({
          hour: currentDateTime.hour,
          minute: currentDateTime.minute,
          second: currentDateTime.second,
          millisecond: currentDateTime.millisecond
        });
      }

      this.timestampControl?.setValue(dateTime.toMillis());
      this.formattedScheduledDate.set(dateTime.toFormat('MMM dd, yyyy HH:mm'));
    }
  }

  onTimeChange(event: any) {
    const timeValue = event.target.value;

    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const currentTimestamp = this.timestampControl?.value;

      let dateTime = currentTimestamp
        ? DateTime.fromMillis(currentTimestamp)
        : DateTime.now();

      dateTime = dateTime.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
      this.timestampControl?.setValue(dateTime.toMillis());
      this.formattedScheduledDate.set(dateTime.toFormat('MMM dd, yyyy HH:mm'));
    }
  }

  getFormattedTime(): string {
    const timestamp = this.timestampControl?.value;
    if (timestamp) {
      return DateTime.fromMillis(timestamp).toFormat('HH:mm');
    }
    return DateTime.now().toFormat('HH:mm');
  }

  checkIfEdit() {
    return this.data != null && this.data != undefined;
  }

  assignFormValues() {
    this.messageControl?.setValue(this.data.messageContent ?? "");
    // this.mediaControl?.setValue(this.data.mediaAttachment ?? new Array<string>());

    // This should be reworked
    this.timestampControl?.setValue(this.data.timestamp);
    this.timestampTypeControl?.setValue(this.data.timestamp != undefined && this.data.timestamp != null && this.data.timestamp > 0 ? this.timestampTypes.Scheduled : this.timestampTypes.Draft);

    if (this.data.timestamp) {
      const dateTime = DateTime.fromMillis(this.data.timestamp);
      this.formattedScheduledDate.set(dateTime.toFormat('MMM dd, yyyy HH:mm'));
    }
  }

  getTimestamp(): number | null {
    return this.timestampControl?.value ?? null;
  }

  getSelectedDate(): Date | null {
    const timestamp = this.timestampControl?.value;
    return timestamp ? DateTime.fromMillis(timestamp).toJSDate() : null;
  }

  getErrorMessage(control: AbstractControl | undefined | null): string {
    return formErrorMessage(control);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.handleFiles(input.files);
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  private handleFiles(fileList: FileList): void {
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (fileList.length + this.files().length > 4) {
      alert("Maximum 4 attachments allowed");
    }
    else {
      Array.from(fileList).forEach(file => {
        if (acceptedTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = e => {
            const result = e.target?.result as string;
            this.files.update(arr => [...arr, file]);
            this.previews.update(arr => [...arr, result]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removeFile(index: number): void {
    this.files.update(arr => arr.filter((_, i) => i !== index));
    this.previews.update(arr => arr.filter((_, i) => i !== index));
  }

  submit() {
    let integrationIds = new Array<string>();

    (this.platformsControl?.value as ConnectedIntegrationDto[]).forEach(integration => {
      integrationIds.push(integration.userPlatformIntegrationId);
    });

    if (this.checkIfEdit()) {
      this.postService.updatePost(
        this.data.postId,
        this.messageControl?.value ?? "",
        this.files(),
        this.timestampControl?.value || null,
        integrationIds);
    }
    else {
      this.postService.createPost(
        this.messageControl?.value ?? "",
        this.files(),
        this.timestampControl?.value || null,
        integrationIds);
    }

    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
