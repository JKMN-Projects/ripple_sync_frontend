import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
  selector: 'app-icon-container',
  imports: [MatIconModule, ɵEmptyOutletComponent],
  templateUrl: './icon-container.html',
  styleUrl: './icon-container.scss',
})
export class IconContainer {
  @Input() iconName: string = '';
  @Input() shape: 'circle' | 'square' = 'circle';
}
