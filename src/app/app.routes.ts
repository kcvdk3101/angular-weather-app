import { Routes } from '@angular/router';
import { CityDetailComponent } from './components/city-detail/city-detail';
import { FavoritesComponent } from './components/favorites/favorites';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { WeatherSearchComponent } from './components/weather-search/weather-search';
import { authGuard } from './guards/auth.guard';

export const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '', component: WeatherSearchComponent, canActivate: [authGuard] },
  { path: 'city/:name', component: CityDetailComponent, canActivate: [authGuard] },
  { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];