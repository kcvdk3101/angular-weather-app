import { TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { WeatherService } from '../../services/weather.service';
import { of } from 'rxjs';

describe('FavoritesComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [FavoritesComponent],
      providers: [
        AuthService,
        {
          provide: FavoritesService,
          useValue: {
            favoritesNames: () => ['Paris', 'Tokyo'],
            removeFavoriteByName: () => { }
          }
        },
        {
          provide: WeatherService,
          useValue: {
            getCityByName: (n: string) => of({
              id: Math.random(),
              name: n,
              country: 'FR',
              current: { dt: 0, temp: 20, weather: [{ main: 'Clear', description: 'clear', icon: '01d' }] }
            })
          }
        }
      ]
    }).compileComponents();
  });

  // Test case to load favorite cities
  it('loads favorites cities', () => {
    const fixture = TestBed.createComponent(FavoritesComponent);
    fixture.componentInstance.reload();
    expect(fixture.componentInstance.favorites.length).toBe(2);
  });

  // Test case to show error message
  it('shows error message on load failure', () => {
    const weatherService = TestBed.inject(WeatherService);
    spyOn(weatherService, 'getCityByName').and.returnValue(
      of(undefined)
    );
    const fixture = TestBed.createComponent(FavoritesComponent);
    fixture.componentInstance.reload();
    expect(fixture.componentInstance.error()).toBe('Cannot load favorites list.');
  });

  // Test case to remove a favorite city
  it('removes a favorite city', () => {
    const fixture = TestBed.createComponent(FavoritesComponent);
    fixture.componentInstance.remove('Paris');
    expect(fixture.componentInstance.favorites.length).toBe(2);
  });

  // Test case to check if there are favorites
  it('checks if has favorites', () => {
    const fixture = TestBed.createComponent(FavoritesComponent);
    fixture.componentInstance.reload();
    expect(fixture.componentInstance.hasFavorites()).toBeTrue();
  });
});