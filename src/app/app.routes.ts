import { Routes } from '@angular/router';
import { SharedFooterComponent } from './pages/shared-footer/shared-footer.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.component').then(m => m.SplashComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((p) => p.HomeComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('./pages/progress/progress.component').then((p) => p.ProgressComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/add/add.component').then((p) => p.AddComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then((x) => x.ProfileComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];