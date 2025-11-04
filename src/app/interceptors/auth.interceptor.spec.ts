import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        AuthService
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    await auth.signup('zz', 'pw1234');
    await auth.login('zz', 'pw1234');
  });

  it('does not add Authorization for OpenWeather', () => {
    // request OpenWeather
    fetchViaAngular('https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=DUMMY');
    const req = httpMock.expectOne(r => r.url.includes('/data/2.5/weather'));
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('adds Authorization for backend /api/', () => {
    fetchViaAngular('/api/test');
    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toContain('Bearer');
    req.flush({});
  });

  function fetchViaAngular(url: string) {
    const http = TestBed.inject(HttpClient);
    http.get(url).subscribe();
  }
});