import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { CityWeather } from '../../models/weather.model';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CurrentWeatherCardComponent } from '../current-weather-card/current-weather-card';

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule, CurrentWeatherCardComponent],
  templateUrl: './city-detail.html',
  styleUrls: ['./city-detail.scss']
})
export class CityDetailComponent implements OnInit {
  city$?: Observable<CityWeather | undefined>;

  constructor(private route: ActivatedRoute, private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.city$ = this.route.paramMap.pipe(
      switchMap(params => {
        const name = params.get('name') || '';
        return this.weatherService.getCityByName(name);
      })
    );
  }
}