import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

class DummyRouter {
  url: string | null = null;
  navigateByUrl(u: string) { this.url = u; }
}

describe('LoginComponent', () => {
  let router: DummyRouter;
  let authService: AuthService;

  beforeEach(async () => {
    // Clear localStorage before each test
    localStorage.clear();

    router = new DummyRouter();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } }
      ]
    }).compileComponents();
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test case to display login UI
  it('shows login form', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  // Test case for invalid form submission
  it('shows error on invalid form submit', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(fixture.componentInstance.error()).toBeTruthy();
  });

  // Test case for valid login
  it('logs in with valid data', async () => {
    // Create user first
    await authService.signup('test-user', 'test-password');

    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.form.patchValue({
      username: 'test-user',
      password: 'test-password'
    });
    await fixture.componentInstance.submit();
    expect(router.url).toBe('/');
  });

  // Test case for login with returnUrl
  it('redirects to returnUrl after login', async () => {
    // Create user first
    await authService.signup('test-user', 'test-password');

    const returnUrl = '/favorites';
    const activatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(activatedRoute.snapshot.queryParamMap, 'get').and.returnValue(returnUrl);
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.form.patchValue({
      username: 'test-user',
      password: 'test-password'
    });
    await fixture.componentInstance.submit();
    expect(router.url).toBe(returnUrl);
  });

  // Test case for failed login
  it('shows error on failed login', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.form.patchValue({
      username: 'wrong-user',
      password: 'wrong-password'
    });
    await fixture.componentInstance.submit();
    expect(fixture.componentInstance.error()).toBeTruthy();
  });

  // Test case for exception during login
  it('shows error on login exception', async () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.callFake(() => {
      throw new Error('Network error');
    });
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.form.patchValue({
      username: 'test-user',
      password: 'test-password'
    });
    await fixture.componentInstance.submit();
    expect(fixture.componentInstance.error()).toBeTruthy();
  });
});