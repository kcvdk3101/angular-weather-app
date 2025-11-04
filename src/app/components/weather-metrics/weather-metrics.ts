import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CityWeather } from '../../models/weather.model';

@Component({
  selector: 'app-weather-metrics',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './weather-metrics.html',
  styleUrls: ['./weather-metrics.scss']
})
export class WeatherMetricsComponent {
  @Input() city?: CityWeather;

  toDate(sec?: number): Date | null {
    return sec ? new Date(sec * 1000) : null;
  }
}