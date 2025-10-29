import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Post } from '../../interfaces/post';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Integration, IntegrationDto } from '../../services/integration';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { DateTime } from 'luxon';

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
  private data = inject<Post>(MAT_DIALOG_DATA);
  private postService = inject(PostService);
  private integrationService = inject(Integration);
  private dialogRef = inject(MatDialogRef<UpsertPost>);
  integrations = signal<IntegrationDto[] | null>([]);

  fruits = ['Apple', 'Banana', 'Cherry', 'Grapes'];

  readonly timestampTypes = TimestampTypes;

  readonly timestampOptions = [
    { label: 'Now', value: TimestampTypes.Now },
    { label: 'Scheduled', value: TimestampTypes.Scheduled },
    { label: 'Draft', value: TimestampTypes.Draft }
  ];

  showDatePicker = signal(false);
  formattedScheduledDate = signal('');

  postFormGroup = this.fb.group({
    message: new FormControl<string | null>(null, [Validators.required, Validators.minLength(1)]),
    media: new FormControl<Array<string> | null>(new Array<string>()),
    platforms: new FormControl<Array<string> | null>(null, [Validators.required]),
    timestampType: new FormControl<TimestampTypes | null>(null),
    timestamp: new FormControl<number | null>(null)
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
      this.integrations.set(
        this.integrationService.integrations()?.filter(i => i.connected == true) ?? null)
    })
  }

  ngOnInit(): void {
    this.integrationService.getIntegrations();
    // Call getIntegrations

    if (this.checkIfEdit()) {
      this.assignFormValues();
    }
  }

  onChipSelect(type: TimestampTypes) {
    this.timestampTypeControl?.setValue(type);

    if (type === TimestampTypes.Now) {
      // Set current timestamp
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
      // Get current timestamp to preserve the time
      const currentTimestamp = this.timestampControl?.value;
      let dateTime = DateTime.fromJSDate(selectedDate);

      // If we already have a timestamp, preserve its time
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

      // Get the current date or use today
      let dateTime = currentTimestamp
        ? DateTime.fromMillis(currentTimestamp)
        : DateTime.now();

      // Set the new time
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
    this.mediaControl?.setValue(this.data.mediaAttachment ?? new Array<string>());
    // this.platformsControl?.setValue() // Find platform in integration list
    this.timestampControl?.setValue(this.data.timestamp);

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

  getMessageErrorMessage(): string {
    if (this.messageControl?.hasError('required')) {
      return 'Message is required';
    }
    if (this.messageControl?.hasError('minLength')) {
      return 'Must contain atleast 1 character';
    }
    return '';
  }

  submit() {

  }

  cancel(): void {
    this.dialogRef.close();
  }
}
