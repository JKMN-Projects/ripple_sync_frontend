import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Stack } from '../../components/stack/stack';
import { MatCardModule } from '@angular/material/card';
import { IconContainer } from "../../components/icon-container/icon-container";

@Component({
  selector: 'app-home',
  imports: [
    MatButton,
    MatGridListModule,
    MatCardModule,
    Stack,
    IconContainer
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
