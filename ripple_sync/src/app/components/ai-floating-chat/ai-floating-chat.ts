import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ChatMessage {
  sender: 'user' | 'system';
  text: string;
}

@Component({
  selector: 'app-ai-floating-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ai-floating-chat.html',
  styleUrls: ['./ai-floating-chat.scss']
})
export class AiFloatingChatComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  open = signal(true);
  loading = signal(false);
  messages = signal<ChatMessage[]>([
    { sender: 'system', text: 'Hi! I’m your social media assistant. Paste your post or ask for advice!' }
  ]);

  form = this.fb.group({
    userMessage: ['', Validators.required],
  });

  toggle() {
    this.open.update(v => !v);
  }

  async send() {
    if (this.form.invalid || this.loading()) return;
    const userMessage = this.form.value.userMessage!;
    this.messages.update(m => [...m, { sender: 'user', text: userMessage }]);
    this.form.reset();
    this.loading.set(true);

    try {
      const res: any = await firstValueFrom(this.http.post(environment.apiUrl + '/feedback/conversation', {
        message: userMessage,
        history: this.messages().map(m => ({ role: m.sender, content: m.text }))
      }));

      const reply = res.reply || 'No response';
      this.messages.update(m => [...m, { sender: 'system', text: reply }]);
    } catch (err: any) {
      this.messages.update(m => [...m, { sender: 'system', text: 'Error: ' + (err.error?.error || err.message) }]);
    } finally {
      this.loading.set(false);
    }
  }
}
