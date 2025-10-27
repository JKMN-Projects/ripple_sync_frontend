import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Stack } from '../../components/stack/stack';

@Component({
  selector: 'app-home',
  imports: [MatButton, MatGridListModule, Stack],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
