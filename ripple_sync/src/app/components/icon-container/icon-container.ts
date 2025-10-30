import { Component, input, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-container',
  imports: [MatIconModule],
  templateUrl: './icon-container.html',
  styleUrl: './icon-container.scss',
})
export class IconContainer {
  iconName = input<string>('');
  shape = input<'circle' | 'square'>('circle');
  size = input<'lg' | 'sm' | 'md'>('md');
  noGradient = input<boolean>(false);
}
