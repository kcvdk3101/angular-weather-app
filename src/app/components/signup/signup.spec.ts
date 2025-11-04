import { TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

class DummyRouter {
  url: string | null = null;
  navigateByUrl(u: string) { this.url = u; }
}

describe('SignupComponent', () => {
  let router: DummyRouter;

  beforeEach(async () => {
    router = new DummyRouter();
    await TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } }
      ]
    }).compileComponents();
  });

  // Test case to display signup UI
  it('shows signup form', () => {
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();
  });


  // Test case for invalid form submission
  it('shows error when password mismatch', async () => {
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.form.setValue({ username: 'u', password: '1234', confirm: '9999' });
    await comp.submit();
    const err = comp.error();
    expect(err).toBeTruthy();
  });

  // Test case for password confirmation mismatch
  it('shows error on invalid form submit', async () => {
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.form.setValue({ username: 'test-user', password: '123456', confirm: '12345' });
    await comp.submit();
    const err = comp.error();
    expect(err).toContain('does not match');
  });

  // Test case for successful signup
  it('signs up with valid data', async () => {
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.form.setValue({ username: 'newuser', password: 'password123', confirm: 'password123' });
    await comp.submit();
    expect(router.url).toBe('/');
  });

  // Test case for existing username
  it('shows error for existing username', async () => {
    const authService = TestBed.inject(AuthService);
    // Pre-create user
    await authService.signup('existinguser', 'password123');
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.form.setValue({ username: 'existinguser', password: 'password123', confirm: 'password123' });
    await comp.submit();
    const err = comp.error();
    expect(err).toBeTruthy();
  });

  // Test case for redirect to login page after signup
  it('redirects to login after signup with returnUrl', async () => {
    const fixture = TestBed.createComponent(SignupComponent);
    const comp = fixture.componentInstance;
    comp.form.setValue({ username: 'anotheruser', password: 'password123', confirm: 'password123' });
    // Mock returnUrl
    (comp as any).route.snapshot.queryParamMap.get = (key: string) => {
      if (key === 'returnUrl') return '/login';
      return null;
    };
    await comp.submit();
    expect(router.url).toBe('/login');
  });
});