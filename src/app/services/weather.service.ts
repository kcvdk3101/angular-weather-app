import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CityWeather, MockWeatherFile } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private mockUrl = '/assets/mock-weather.json';

  constructor(private http: HttpClient) { }

  // Return all cities from the mock file
  getAllCities(): Observable<CityWeather[]> {
    return this.http.get<MockWeatherFile>(this.mockUrl).pipe(map(res => res.cities || []));
  }

  // Return a specific city by name
  getCityByName(name: string): Observable<CityWeather | undefined> {
    const q = name?.trim().toLowerCase();
    return this.getAllCities().pipe(
      map(cities => cities.find(c => c.name.toLowerCase() === q))
    );
  }

  // Return city by id
  getCityById(id: number): Observable<CityWeather | undefined> {
    return this.getAllCities().pipe(map(cities => cities.find(c => c.id === id)));
  }
}