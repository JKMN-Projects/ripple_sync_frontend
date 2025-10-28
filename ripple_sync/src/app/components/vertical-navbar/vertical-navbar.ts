import { Component } from '@angular/core';
import { MatDivider } from "@angular/material/divider";
import { Stack } from "../stack/stack";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import { IconContainer } from "../icon-container/icon-container";

@Component({
  selector: 'app-vertical-navbar',
  imports: [
    MatDivider,
    MatButtonModule,
    RouterLink,
    IconContainer
],
  templateUrl: './vertical-navbar.html',
  styleUrl: './vertical-navbar.scss',
})
export class VerticalNavbar {

}
