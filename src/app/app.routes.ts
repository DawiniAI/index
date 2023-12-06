import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'choose-language',
    loadComponent: () => import('./pages/choose-language/choose-language.page').then( m => m.ChooseLanguagePage),
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/tabs/medications-search/medications-search.page').then((m) => m.MedicationsSearchPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'medication/:id',
    loadComponent: () => import('./pages/medication-details/medication-details.page').then( m => m.MedicationDetailsPage),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'advanced-search',
    loadComponent: () => import('./pages/advanced-search/advanced-search.page').then( m => m.AdvancedSearchPage)
  },

];
