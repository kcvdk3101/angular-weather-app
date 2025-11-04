import { Injectable, signal } from '@angular/core';
import { AppUser, AuthTokenPayload, AuthTokenData } from '../models/user.model';
import { hashPassword, verifyPassword } from '../utils/password.util';
import { signJwt, verifyJwt, isExpired, isWithinGrace } from '../utils/jwt.util';

const USERS_KEY = 'weather_app_users';
const AUTH_KEY = 'weather_app_auth_token';

interface LoginResult {
  success: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private usersSig = signal<AppUser[]>(this.loadUsers());
  private authTokenSig = signal<AuthTokenData | null>(this.loadToken());

  isAuthenticated = () => !!this.authTokenSig();
  currentUsername = () => this.authTokenSig()?.payload.sub || '';

  private loadUsers(): AppUser[] {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }
  private persistUsers(users: AppUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    this.usersSig.set(users);
  }

  private loadToken(): AuthTokenData | null {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const token = JSON.parse(raw).token as string;
      // verify
      return { token, payload: JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) };
    } catch { return null; }
  }
  private persistToken(data: AuthTokenData | null) {
    if (!data) {
      localStorage.removeItem(AUTH_KEY);
      this.authTokenSig.set(null);
      return;
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: data.token }));
    this.authTokenSig.set(data);
  }

  async signup(username: string, password: string): Promise<LoginResult> {
    username = username.trim();
    if (!username || !password) return { success: false, error: 'Missing information.' };
    if (this.usersSig().some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already exists.' };
    }
    const passwordHash = await hashPassword(password);
    const newUser: AppUser = { username, passwordHash, createdAt: Date.now() };
    this.persistUsers([...this.usersSig(), newUser]);
    // Automatically log in after signup
    return await this.login(username, password);
  }

  async login(username: string, password: string): Promise<LoginResult> {
    const user = this.usersSig().find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return { success: false, error: 'Invalid username or password.' };
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return { success: false, error: 'Invalid username or password.' };
    const jwt = await signJwt(user.username);
    const payloadPart = jwt.split('.')[1];
    const payload: AuthTokenPayload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
    this.persistToken({ token: jwt, payload });
    return { success: true };
  }

  logout() {
    this.persistToken(null);
  }

  async refreshIfNeeded(): Promise<boolean> {
    const data = this.authTokenSig();
    if (!data) return false;
    if (!isExpired(data.payload)) return true;
    if (isWithinGrace(data.payload)) {
      const newJwt = await signJwt(data.payload.sub);
      const payloadPart = newJwt.split('.')[1];
      const payload: AuthTokenPayload = JSON.parse(atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/')));
      this.persistToken({ token: newJwt, payload });
      return true;
    }
    this.logout();
    return false;
  }

  getAuthHeader(): string | null {
    const t = this.authTokenSig();
    if (!t) return null;
    if (isExpired(t.payload) && !isWithinGrace(t.payload)) return null;
    return `Bearer ${t.token}`;
  }
}