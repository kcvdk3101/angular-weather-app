import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

class DummyRouter {
  urlNavigated: string | null = null;
  navigate(commands: any[], extras?: any) {
    this.urlNavigated = (commands[0] as string) || '';
  }
}

describe('authGuard', () => {
  let router: DummyRouter;
  let auth: AuthService;

  beforeEach(() => {
    // Clear localStorage before each test to ensure clean state
    localStorage.clear();

    router = new DummyRouter();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: router }
      ]
    });
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('blocks when not authenticated', async () => {
    const can = await TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/favorites' } as any)
    );
    expect(can).toBe(false);
    expect(router.urlNavigated).toContain('/login');
  });

  it('allows when authenticated', async () => {
    await auth.signup('u1', 'p1234');
    await auth.login('u1', 'p1234');
    const can = await TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/' } as any)
    );
    expect(can).toBe(true);
  });
});