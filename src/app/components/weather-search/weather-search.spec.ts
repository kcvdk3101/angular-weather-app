import { TestBed } from '@angular/core/testing';
import { WeatherSearchComponent } from './weather-search';
import { WeatherService } from '../../services/weather.service';
import { of } from 'rxjs';

describe('WeatherSearchComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherSearchComponent],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getCityByName: (name: string) => of({
              id: 1,
              name,
              country: 'VN',
              current: {
                dt: 0, temp: 30, feels_like: 31,
                humidity: 70, pressure: 1008,
                wind_speed: 2, wind_deg: 90,
                sunrise: 1000, sunset: 2000,
                weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }]
              }
            })
          }
        }
      ]
    }).compileComponents();
  });

  it('searches and sets city$', () => {
    const fixture = TestBed.createComponent(WeatherSearchComponent);
    fixture.componentInstance.q.setValue('Hanoi');
    fixture.componentInstance.onSearch();
    expect(fixture.componentInstance.city$).toBeTruthy();
  });
});