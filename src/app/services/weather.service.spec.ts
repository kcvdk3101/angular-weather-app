import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { environment } from '../../environments/environment';

describe('WeatherService', () => {
  let service: WeatherService;
  let http: HttpTestingController;

  beforeEach(() => {
    environment.useMock = false;
    TestBed.configureTestingModule({
      providers: [WeatherService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(WeatherService);
    http = TestBed.inject(HttpTestingController);
  });

  it('fetches current weather and maps city', (done) => {
    service.getCityByName('Paris').subscribe(city => {
      expect(city).toBeTruthy();
      expect(city!.name).toBe('Paris');
      expect(city!.current.temp).toBe(20);
      done();
    });

    const req = http.expectOne(r => r.url.includes('/weather'));
    expect(req.request.params.get('q')).toBe('Paris');
    req.flush({
      dt: 1111,
      name: 'Paris',
      sys: { country: 'FR', sunrise: 1000, sunset: 2000 },
      main: { temp: 20, feels_like: 19, humidity: 50, pressure: 1008 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 3.1, deg: 90 },
      coord: { lon: 2.35, lat: 48.85 }
    });
    http.verify();
  });
});