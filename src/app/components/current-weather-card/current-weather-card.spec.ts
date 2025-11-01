import { TestBed } from '@angular/core/testing';
import { CurrentWeatherCardComponent } from './current-weather-card';
import { FavoritesService } from '../../services/favorites.service';
import { CityWeather } from '../../models/weather.model';

describe('CurrentWeatherCardComponent (standalone)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentWeatherCardComponent],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            isFavorite: () => false,
            addFavorite: () => { },
            removeFavorite: () => { }
          }
        }
      ]
    }).compileComponents();
  });

  it('renders city name', () => {
    const fixture = TestBed.createComponent(CurrentWeatherCardComponent);
    const component = fixture.componentInstance;
    component.city = {
      id: 1,
      name: 'Paris',
      country: 'FR',
      current: { dt: 0, temp: 280, weather: [{ main: 'Clear', description: 'clear', icon: '01d' }] },
      forecast: []
    } as CityWeather;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Paris');
  });
});