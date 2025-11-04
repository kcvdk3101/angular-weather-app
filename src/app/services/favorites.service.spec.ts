import { TestBed } from '@angular/core/testing';
import { FavoritesService } from './favorites.service';
import { AuthService } from './auth.service';

describe('FavoritesService', () => {
  let fav: FavoritesService;
  let auth: AuthService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [FavoritesService, AuthService]
    });
    fav = TestBed.inject(FavoritesService);
    auth = TestBed.inject(AuthService);
    await auth.signup('userA', 'pw1111');
    await auth.login('userA', 'pw1111');
    fav.reloadForUser();
  });

  it('adds and removes favorites by name', () => {
    fav.addFavoriteByName('Paris');
    fav.addFavoriteByName('Berlin');
    expect(fav.favoritesNames().length).toBe(2);
    fav.removeFavoriteByName('Paris');
    expect(fav.favoritesNames()).toEqual(['Berlin']);
  });

  it('isFavoriteByName works', () => {
    fav.addFavoriteByName('Tokyo');
    expect(fav.isFavoriteByName('Tokyo')).toBeTrue();
    expect(fav.isFavoriteByName('Osaka')).toBeFalse();
  });
});