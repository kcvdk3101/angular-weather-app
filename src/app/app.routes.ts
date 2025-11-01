import { Routes } from '@angular/router';
import { WeatherSearchComponent } from './components/weather-search/weather-search';
import { CityDetailComponent } from './components/city-detail/city-detail';
import { FavoritesComponent } from './components/favorites/favorites';

export const APP_ROUTES: Routes = [
  { path: 'city/:name', component: CityDetailComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '', component: WeatherSearchComponent },
  { path: '**', redirectTo: '' }
];