import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CurrentWeatherCardComponent } from './current-weather-card';
import { FavoritesService } from '../../services/favorites.service';
import { WeatherService } from '../../services/weather.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('CurrentWeatherCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentWeatherCardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: WeatherService,
          useValue: {
            getCityByName: () => of(undefined)
          }
        },
        {
          provide: FavoritesService,
          useValue: {
            isFavoriteByName: () => false,
            addFavoriteByName: () => { },
            removeFavoriteByName: () => { }
          }
        }
      ]
    }).compileComponents();
  });

  // Test case to display city name and temperature
  it('shows city name & temp', () => {
    const fixture = TestBed.createComponent(CurrentWeatherCardComponent);
    fixture.componentInstance.city = {
      id: 123,
      name: 'Rome',
      country: 'IT',
      current: {
        dt: 0,
        temp: 25,
        feels_like: 24,
        humidity: 55,
        pressure: 1009,
        wind_speed: 2,
        wind_deg: 180,
        sunrise: 1000,
        sunset: 2000,
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
      }
    };
    fixture.detectChanges();
    const html = fixture.nativeElement.textContent;
    expect(html).toContain('Rome');
    expect(html).toContain('25');
  });

  // Test case to toggle favorite status
  it('toggles favorite status', () => {
    const favoritesService = TestBed.inject(FavoritesService);
    spyOn(favoritesService, 'isFavoriteByName').and.returnValue(false);
    const addSpy = spyOn(favoritesService, 'addFavoriteByName');
    const removeSpy = spyOn(favoritesService, 'removeFavoriteByName');
    const fixture = TestBed.createComponent(CurrentWeatherCardComponent);
    fixture.componentInstance.city = {
      id: 123,
      name: 'Berlin',
      country: 'DE',
      current: {
        dt: 0,
        temp: 18,
        feels_like: 18,
        humidity: 60,
        pressure: 1012,
        wind_speed: 3,
        wind_deg: 90,
        sunrise: 1000,
        sunset: 2000,
        weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }]
      }
    };
    fixture.detectChanges();
    fixture.componentInstance.toggleFavorite();
    expect(addSpy).toHaveBeenCalledWith('Berlin');
    // Now simulate it being a favorite
    favoritesService.isFavoriteByName = () => true;
    fixture.componentInstance.toggleFavorite();
    expect(removeSpy).toHaveBeenCalledWith('Berlin');
  });

  // Test case to handle city not found error
  it('handles city not found error', () => {
    const weatherService = TestBed.inject(WeatherService);
    spyOn(weatherService, 'getCityByName').and.returnValue(of(undefined));
    const fixture = TestBed.createComponent(CurrentWeatherCardComponent);
    fixture.componentInstance.cityName = 'NonExistentCity';
    fixture.detectChanges();
    expect(fixture.componentInstance.errorSig()).toBe('City "NonExistentCity" not found.');
  });

  // Test case to handle fetch error
  it('handles fetch error', () => {
    const weatherService = TestBed.inject(WeatherService);
    spyOn(weatherService, 'getCityByName').and.returnValue(throwError(() => new Error('Network error')));
    const fixture = TestBed.createComponent(CurrentWeatherCardComponent);
    fixture.componentInstance.cityName = 'AnyCity';
    fixture.detectChanges();
    expect(fixture.componentInstance.errorSig()).toBe('Network error');
  });
});