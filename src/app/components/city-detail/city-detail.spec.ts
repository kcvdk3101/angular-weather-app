import { TestBed } from '@angular/core/testing';
import { CityDetailComponent } from './city-detail';
import { WeatherService } from '../../services/weather.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('CityDetailComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityDetailComponent],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getCityByName: (name: string) => of({
              id: 1,
              name,
              country: 'US',
              current: { dt: 0, temp: 10, weather: [{ main: 'Rain', description: 'rain', icon: '10d' }] }
            })
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ name: 'New York' }))
          }
        }
      ]
    }).compileComponents();
  });

  it('initializes city$', (done) => {
    const fixture = TestBed.createComponent(CityDetailComponent);
    fixture.detectChanges(); // triggers ngOnInit
    fixture.componentInstance.city$!.subscribe(city => {
      expect(city!.name).toBe('New York');
      done();
    });
  });
});