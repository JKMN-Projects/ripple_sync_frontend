import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stack',
  imports: [CommonModule],
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
})
export class Stack {
  @Input() direction: 'row' | 'column' = 'column';
  @Input() gap: number = 0;
  @Input() justify: 'space-between' | 'left' = 'left'
}
