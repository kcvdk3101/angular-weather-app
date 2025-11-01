import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from '../../environments/environment';

describe('WeatherService (OpenWeather integration)', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    environment.useMock = false; // ensure real path
    TestBed.configureTestingModule({
      providers: [WeatherService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('maps current + forecast responses', (done) => {
    service.getCityByName('Paris').subscribe(city => {
      expect(city).toBeTruthy();
      expect(city?.name).toBe('Paris');
      done();
    });

    const currentReq = httpMock.expectOne(r => r.url.includes('/weather'));
    currentReq.flush({
      dt: 123456,
      name: 'Paris',
      sys: { country: 'FR' },
      main: { temp: 20, feels_like: 19, humidity: 50 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 2.5 },
      coord: { lon: 2.35, lat: 48.85 }
    });

    const forecastReq = httpMock.expectOne(r => r.url.includes('/forecast'));
    forecastReq.flush({
      city: { name: 'Paris', country: 'FR' },
      list: [
        { dt: 123457, main: { temp: 21 }, weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }] },
        { dt: 123458, main: { temp: 22 }, weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }] }
      ]
    });

    httpMock.verify();
  });
});