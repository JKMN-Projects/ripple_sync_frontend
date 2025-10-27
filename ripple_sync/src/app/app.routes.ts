import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Component } from '@angular/core';
import { Integrations } from './pages/integrations/integrations';

export const routes: Routes = [
  { path: '', component: Home }
  , {path: 'integrations', component: Integrations}
];
