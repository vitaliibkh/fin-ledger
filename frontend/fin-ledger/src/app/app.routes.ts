import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },

  {
    path: 'operations',
    loadChildren: () => import('./features/operations/operations-module').then(m => m.OperationsModule),
    canActivate: [roleGuard],
    data: { roles: ['Operator', 'Financial Manager', 'Analyst'] }
  },

  {
    path: 'management',
    loadChildren: () => import('./features/management/management-module').then(m => m.ManagementModule),
    canActivate: [roleGuard],
    data: { roles: ['Operator', 'Financial Manager', 'Analyst'] }
  },

  {
    path: 'analytics',
    loadChildren: () => import('./features/analytics/analytics-module').then(m => m.AnalyticsModule),
    canActivate: [roleGuard],
    data: { roles: ['Analyst'] }
  },

  { path: '', redirectTo: 'auth', pathMatch: 'full' },

  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found').then(c => c.NotFound)
  },

  {
    path: 'not-found',
    loadComponent: () => import('./features/not-found/not-found').then(c => c.NotFound)
  },

  { path: '**', redirectTo: 'not-found' }
];
