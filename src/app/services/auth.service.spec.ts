import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  // Clear localStorage after each test
  afterEach(() => {
    localStorage.clear();
  });

  // Test case for loading user from storage
  it('loads user from storage', async () => {
    await service.signup('usertest', 'password123');
    const service2 = TestBed.inject(AuthService);
    expect(service2.isAuthenticated()).toBeTrue();
    expect(service2.currentUsername()).toBe('usertest');
  });

  // Test case for persist token
  it('persists token correctly', async () => {
    await service.signup('persistUser', 'persistPass');
    const token = localStorage.getItem('weather_app_auth_token');
    expect(token).toBeTruthy();
  });

  // Test case for signup and login
  it('signs up and logs in a user', async () => {
    const signup = await service.signup('user1', 'pass123');
    expect(signup.success).toBeTrue();
    const loginRes = await service.login('user1', 'pass123');
    expect(loginRes.success).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUsername()).toBe('user1');
  });

  // Test case for rejecting bad login
  it('rejects bad login', async () => {
    const login = await service.login('nouser', 'pass');
    expect(login.success).toBeFalse();
  });

  // Test case for logout
  it('logs out a user', async () => {
    await service.signup('user2', 'pass234');
    expect(service.isAuthenticated()).toBeTrue();
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
  });

  // Test case for refresh
  it('refreshIfNeeded returns true when not expired', async () => {
    await service.signup('u', 'p1234');
    await service.login('u', 'p1234');
    const ok = await service.refreshIfNeeded();
    expect(ok).toBeTrue();
  });

  // Test case for refresh failure
  it('refreshIfNeeded logs out when expired', async () => {
    await service.signup('u', 'p1234');
    await service.login('u', 'p1234');
    // Manually expire the token beyond grace period
    const tokenData = service['authTokenSig']();
    if (tokenData) {
      tokenData.payload.exp = Math.floor(Date.now() / 1000) - 400;
      service['persistToken'](tokenData);
    }
    const ok = await service.refreshIfNeeded();
    expect(ok).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });
});