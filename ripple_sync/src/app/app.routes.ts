
import { Home } from './pages/home/home';
import { Component } from '@angular/core';
import { Integrations } from './pages/integrations/integrations';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Home }
  , {path: 'integrations', component: Integrations}
];
