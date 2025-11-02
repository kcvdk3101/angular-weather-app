import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FavoritesService } from '../../services/favorites.service';
import { WeatherService } from '../../services/weather.service';
import { CityWeather } from '../../models/weather.model';

import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class FavoritesComponent {
  // Signals for favorites cities, loading state, and error message
  private favoritesCitiesSig = signal<CityWeather[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Getter cho template
  get favorites(): CityWeather[] {
    return this.favoritesCitiesSig();
  }

  constructor(
    private favoritesService: FavoritesService,
    private weatherService: WeatherService
  ) {
    effect(() => {
      const _username = this.favoritesService['auth']?.currentUsername();
      this.reload();
    });
  }

  reload(): void {
    this.loading.set(true);
    this.error.set(null);

    const names = this.favoritesService.favoritesNames();
    if (!names.length) {
      this.favoritesCitiesSig.set([]);
      this.loading.set(false);
      return;
    }

    const requests = names.map(name =>
      this.weatherService.getCityByName(name).pipe(
        catchError(() => of(undefined))
      )
    );

    forkJoin(requests).pipe(
      map(results => results.filter((c): c is CityWeather => !!c))
    ).subscribe({
      next: cities => {
        this.favoritesCitiesSig.set(cities);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Không tải được danh sách yêu thích.');
        this.loading.set(false);
        this.favoritesCitiesSig.set([]);
      }
    });
  }

  remove(name: string): void {
    this.favoritesService.removeFavoriteByName(name);
    this.reload();
  }

  hasFavorites(): boolean {
    return this.favoritesCitiesSig().length > 0;
  }
}