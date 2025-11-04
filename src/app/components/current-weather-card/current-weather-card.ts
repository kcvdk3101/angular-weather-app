import { Component, Input, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CityWeather } from '../../models/weather.model';
import { FavoritesService } from '../../services/favorites.service';
import { WeatherService } from '../../services/weather.service';
import { WeatherMetricsComponent } from '../weather-metrics/weather-metrics';

@Component({
  selector: 'app-current-weather-card',
  standalone: true,
  imports: [CommonModule, RouterLink, WeatherMetricsComponent],
  templateUrl: './current-weather-card.html',
  styleUrls: ['./current-weather-card.scss']
})
export class CurrentWeatherCardComponent {

  /**
   * Optional: if provided, component fetches fresh data from WeatherService (OpenWeather API or mock).
   */
  @Input() cityName?: string;

  /**
   * Backward compatibility: if parent passes a populated CityWeather directly,
   * we render it without fetching.
   */
  @Input() city?: CityWeather;

  // Internal reactive state
  loadingSig = signal(false);
  errorSig = signal<string | null>(null);
  fetchedCitySig = signal<CityWeather | null>(null);

  // Exposed read-only getters for template
  loading = computed(() => this.loadingSig());
  error = computed(() => this.errorSig());
  activeCity = computed<CityWeather | null>(() => {
    // Priority order: explicit CityWeather input > fetched result
    return this.city ?? this.fetchedCitySig();
  });

  // Favorite status derived from active city
  isFav = computed(() => {
    const c = this.activeCity();
    return !!c && this.fav.isFavoriteByName(c.name);
  });

  constructor(
    private fav: FavoritesService,
    private weather: WeatherService
  ) {
    effect(() => {
      const name = this.cityName?.trim();
      if (name && !this.city) {
        this.fetchCity(name);
      }
    });
  }

  /**
   * Toggle favorites for the active city.
   */
  toggleFavorite(): void {
    const c = this.activeCity();
    if (!c) return;
    if (this.fav.isFavoriteByName(c.name)) {
      this.fav.removeFavoriteByName(c.name);
    } else {
      this.fav.addFavoriteByName(c.name);
    }
  }

  /**
   * Fetch city weather data from WeatherService.
   */
  private fetchCity(name: string): void {
    this.loadingSig.set(true);
    this.errorSig.set(null);
    this.fetchedCitySig.set(null);

    this.weather.getCityByName(name).subscribe({
      next: (cw) => {
        if (!cw) {
          this.errorSig.set(`City "${name}" not found.`);
          this.fetchedCitySig.set(null);
        } else {
          this.fetchedCitySig.set(cw);
        }
        this.loadingSig.set(false);
      },
      error: (err) => {
        this.errorSig.set(err?.message || 'Failed to load weather.');
        this.loadingSig.set(false);
      }
    });
  }
}