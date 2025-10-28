import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-container',
  imports: [MatIconModule],
  templateUrl: './icon-container.html',
  styleUrl: './icon-container.scss',
})
export class IconContainer {
  @Input() iconName: string = '';
  @Input() shape: 'circle' | 'square' = 'circle';
}
