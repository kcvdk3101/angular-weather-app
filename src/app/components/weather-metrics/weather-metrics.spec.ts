import { TestBed } from '@angular/core/testing';
import { WeatherMetricsComponent } from './weather-metrics';

describe('WeatherMetricsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherMetricsComponent]
    }).compileComponents();
  });

  // Test case to render weather metrics
  it('renders metrics including temperature', () => {
    const fixture = TestBed.createComponent(WeatherMetricsComponent);
    fixture.componentInstance.city = {
      id: 1,
      name: 'Paris',
      country: 'FR',
      current: {
        dt: 111,
        temp: 21,
        feels_like: 20,
        humidity: 60,
        pressure: 1007,
        wind_speed: 3,
        wind_deg: 45,
        sunrise: 1000,
        sunset: 2000,
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }]
      }
    };
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Sunrise');
    expect(text).toContain('Sunset');
    expect(text).toContain('Pressure');
    expect(text).toContain('Humidity');
    expect(text).toContain('Wind');
  });
});