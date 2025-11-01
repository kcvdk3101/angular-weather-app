import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'weather_app_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private storeKey = STORAGE_KEY;

  // signal of string[] (city names)
  private favNamesSig = signal<string[]>(this.readNamesFromStorage());

  // Expose readonly snapshot getter
  favoritesNames() {
    return this.favNamesSig();
  }

  private readNamesFromStorage(): string[] {
    try {
      const raw = localStorage.getItem(this.storeKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      // If parsed is array of strings -> ok
      if (Array.isArray(parsed) && parsed.every(p => typeof p === 'string')) {
        return parsed;
      }
      // If parsed is array of numbers (old behavior), return as-is (will be migrated later)
      if (Array.isArray(parsed) && parsed.every(p => typeof p === 'number')) {
        // Keep as empty for now; caller can call migrateNumbersToNames()
        return [];
      }
      return [];
    } catch {
      return [];
    }
  }

  private persist(names: string[]) {
    try {
      localStorage.setItem(this.storeKey, JSON.stringify(names));
      this.favNamesSig.set(names);
    } catch {
      // ignore
    }
  }

  // Add a favorite by city name
  addFavoriteByName(name: string) {
    const set = new Set(this.favoritesNames().map(n => n.toLowerCase()));
    if (!set.has(name.toLowerCase())) {
      const updated = [...this.favoritesNames(), name];
      this.persist(updated);
    }
  }

  removeFavoriteByName(name: string) {
    const updated = this.favoritesNames().filter(n => n.toLowerCase() !== name.toLowerCase());
    this.persist(updated);
  }

  isFavoriteByName(name: string): boolean {
    return this.favoritesNames().some(n => n.toLowerCase() === name.toLowerCase());
  }

  // Backwards-compat helper:
  // If the stored value is number[] (old ids), try to migrate them to names using a lookup map.
  // lookupMap: Record<number, string> maps old numeric id -> city name
  migrateNumberIdsToNames(lookupMap: Record<number, string> | null) {
    try {
      const raw = localStorage.getItem(this.storeKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every(p => typeof p === 'number')) {
        if (!lookupMap) {
          // cannot migrate without a map
          localStorage.removeItem(this.storeKey);
          this.favNamesSig.set([]);
          return;
        }
        const names: string[] = parsed
          .map((id: number) => lookupMap[id])
          .filter((n): n is string => typeof n === 'string' && !!n);
        // persist unique names
        const uniq = Array.from(new Set(names));
        this.persist(uniq);
      }
    } catch {
      // ignore
    }
  }
}