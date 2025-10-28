import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Post } from '../../interfaces/post';

@Component({
  selector: 'app-upsert-post',
  imports: [],
  templateUrl: './upsert-post.html',
  styleUrl: './upsert-post.scss',
})
export class UpsertPost implements OnInit {
  fb = inject(FormBuilder);
  data = inject<Post>(MAT_DIALOG_DATA);
  postService = inject(PostService);

  postFormGroup = this.fb.group({
    message: new FormControl("", [Validators.required, Validators.minLength(1)]),
    media: new FormControl(null),
    platforms: new FormControl(null, [Validators.required]),
    timestamp: new FormControl(null)
  })

  get messageControl(): FormControl {
    return this.postFormGroup.get("message") as FormControl;
  }

    get mediaControl(): FormControl {
    return this.postFormGroup.get("media") as FormControl;
  }

    get platformsControl(): FormControl {
    return this.postFormGroup.get("platforms") as FormControl;
  }

    get timestampControl(): FormControl {
    return this.postFormGroup.get("timestamp") as FormControl;
  }

  ngOnInit(): void {
    // Call getIntegrations

    if (this.checkIfEdit()) {
      this.assignFormValues();
    }
  }

  checkIfEdit() {
    return this.data != null && this.data != undefined;
  }

  assignFormValues() {
    this.messageControl.setValue(this.data.messageContent ?? "");
    this.mediaControl.setValue(this.data.mediaAttachment ?? new Array<string>());
    // this.platformsControl.setValue() // Find platform in integration list
    this.timestampControl.setValue(this.data.timestamp);
  }
}
