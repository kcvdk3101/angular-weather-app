import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { CityWeather } from '../../models/weather.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.html',
  styleUrls: ['./weather-search.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class WeatherSearchComponent {
  q = new FormControl('');
  city$?: Observable<CityWeather | undefined>;
  searched = false;

  constructor(private weatherService: WeatherService) { }

  onSearch() {
    const val = this.q.value;
    if (!val || !val.trim()) {
      this.searched = true;
      this.city$ = undefined;
      return;
    }
    this.searched = true;
    this.city$ = this.weatherService.getCityByName(val);
  }
}