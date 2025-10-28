
import { Home } from './pages/home/home';
import { Routes } from '@angular/router';
import { Integrations } from './pages/integrations/integrations';
import { Posts } from './pages/posts/posts';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'posts', component: Posts },
  { path: 'integrations', component: Integrations}
];
