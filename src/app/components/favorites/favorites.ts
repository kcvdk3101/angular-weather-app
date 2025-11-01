import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { WeatherService } from '../../services/weather.service';
import { CityWeather } from '../../models/weather.model';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class FavoritesComponent implements OnInit {
  // signal holding resolved CityWeather[] for display
  private favsSig = signal<CityWeather[]>([]);
  // expose read-only
  get favorites(): CityWeather[] { return this.favsSig(); }

  // loading / error signals
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private favService: FavoritesService,
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
    // If legacy data (number ids) exist, attempt migration by calling weatherService.getAllCities() if available.
    this.attemptMigrationIfNeeded();
  }

  async attemptMigrationIfNeeded() {
    // Try to detect if localStorage currently contains number[] (legacy). If so and weatherService has getAllCities, build lookup
    const raw = (() => {
      try { return localStorage.getItem('weather_app_favorites'); } catch { return null; }
    })();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'number') {
        // legacy numbers found; attempt to build lookup via getAllCities()
        if (typeof (this.weatherService as any).getAllCities === 'function') {
          (this.weatherService as any).getAllCities().pipe(
            map((cities: CityWeather[]) => {
              const lookup: Record<number, string> = {};
              for (const c of cities) lookup[c.id] = c.name;
              return lookup;
            })
          ).subscribe({
            next: (lookup: Record<number, string>) => {
              this.favService.migrateNumberIdsToNames(lookup);
              this.loadFavorites(); // reload after migration
            },
            error: () => {
              // cannot migrate; clear legacy to avoid confusion
              this.favService.migrateNumberIdsToNames(null);
            }
          });
        } else {
          // cannot migrate (no getAllCities); drop legacy
          this.favService.migrateNumberIdsToNames(null);
        }
      }
    } catch {
      // ignore
    }
  }

  loadFavorites() {
    this.loading.set(true);
    this.error.set(null);

    const names = this.favService.favoritesNames();
    if (!names || names.length === 0) {
      this.favsSig.set([]);
      this.loading.set(false);
      return;
    }

    // Resolve each name to CityWeather using weatherService.getCityByName
    const observables = names.map(n =>
      this.weatherService.getCityByName(n).pipe(
        catchError(() => of(undefined))
      )
    );

    // forkJoin on the array of observables; if some are undefined they'll be filtered out
    forkJoin(observables).pipe(
      map(results => results.filter((r): r is CityWeather => !!r))
    ).subscribe({
      next: (cities) => {
        this.favsSig.set(cities);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load favorites');
        this.loading.set(false);
      }
    });
  }

  remove(nameOrId: string | number) {
    // remove by name (preferred). If passed number, attempt to map to name in current list
    if (typeof nameOrId === 'string') {
      this.favService.removeFavoriteByName(nameOrId);
    } else {
      // find in current favorites by matching id and remove by name
      const found = this.favorites.find(f => f.id === nameOrId);
      if (found) this.favService.removeFavoriteByName(found.name);
    }
    this.loadFavorites();
  }
}