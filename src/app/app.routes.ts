import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherSearchComponent } from './components/weather-search/weather-search';

export const routes: Routes = [
  { path: '', component: WeatherSearchComponent },
];