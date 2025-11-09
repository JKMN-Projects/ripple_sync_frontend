
import { Home } from './pages/home/home';
import { Routes } from '@angular/router';
import { Integrations } from './pages/integrations/integrations';
import { Posts } from './pages/posts/posts';
import { Dashboard } from './pages/dashboard/dashboard/dashboard';
import { Calendar } from './pages/calendar/calendar';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'posts', component: Posts },
  { path: 'integrations', component: Integrations},
  { path: 'dashboard', component: Dashboard},
  { path: 'calendar', component: Calendar}
];
