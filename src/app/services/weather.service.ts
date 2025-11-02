import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { OWCurrentResponse } from '../models/openweather-api.model';
import { CityWeather, CurrentWeather, MockWeatherFile } from '../models/weather.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private mockUrl = '/assets/mock-weather.json';

  constructor(private http: HttpClient) { }

  getCityByName(name: string): Observable<CityWeather | undefined> {
    const trimmed = name?.trim();
    if (!trimmed) return of(undefined);

    if (environment.useMock) {
      return this.getAllMockCities().pipe(
        map(cities => cities.find(c => c.name.toLowerCase() === trimmed.toLowerCase()))
      );
    }
    return this.fetchFromOpenWeather(trimmed);
  }

  private getAllMockCities(): Observable<CityWeather[]> {
    return this.http.get<MockWeatherFile>(this.mockUrl).pipe(map(res => res.cities || []));
  }

  private fetchFromOpenWeather(city: string): Observable<CityWeather | undefined> {
    const { baseUrl, units, lang } = environment.openWeather;

    const current$ = this.http.get<OWCurrentResponse>(
      `${baseUrl}/weather`,
      { params: { q: city, units, lang } }
    );

    return forkJoin({ current: current$ }).pipe(
      map(({ current }) => this.mapToCityWeather(current))
    );
  }

  private mapToCityWeather(current: OWCurrentResponse): CityWeather {
    const currentMapped: CurrentWeather = {
      dt: current.dt,
      temp: current.main.temp,
      feels_like: current.main.feels_like,
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      wind_speed: current.wind.speed,
      wind_deg: current.wind.deg,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
      weather: current.weather.map(w => ({
        main: w.main,
        description: w.description,
        icon: w.icon
      }))
    };

    return {
      id: current.dt,
      name: current.name,
      country: current.sys.country,
      current: currentMapped
    };
  }
}