import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  constructor(private auth: AuthService) { }

  private favSig = signal<string[]>(this.load());

  private storageKey(): string {
    const user = this.auth.currentUsername();
    return `weather_app_favorites_${user || 'anon'}`;
  }

  private load(): string[] {
    try {
      const raw = localStorage.getItem(this.storageKey());
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  private persist(list: string[]) {
    localStorage.setItem(this.storageKey(), JSON.stringify(list));
    this.favSig.set(list);
  }

  favoritesNames() { return this.favSig(); }

  addFavoriteByName(name: string) {
    if (!name) return;
    const set = new Set(this.favoritesNames().map(n => n.toLowerCase()));
    if (!set.has(name.toLowerCase())) {
      this.persist([...this.favoritesNames(), name]);
    }
  }

  removeFavoriteByName(name: string) {
    this.persist(this.favoritesNames().filter(n => n.toLowerCase() !== name.toLowerCase()));
  }

  isFavoriteByName(name: string): boolean {
    return this.favoritesNames().some(n => n.toLowerCase() === name.toLowerCase());
  }

  // Call when user changes (login/logout) to reload correct list
  reloadForUser() {
    this.favSig.set(this.load());
  }
}