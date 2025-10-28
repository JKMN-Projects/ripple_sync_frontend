import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stack',
  imports: [CommonModule],
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
})
export class Stack {
  direction = input<'row' | 'column'>('column');
  gap = input<number>(0);
  justify = input<'space-between' | 'left' | 'center'>('left');
  alignItems = input<'center' | 'flex-start'>('flex-start');
}
