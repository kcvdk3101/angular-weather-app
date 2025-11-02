import { Component, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})

export class App {
  protected readonly title = signal('angular-weather-app');

  constructor(public auth: AuthService, private router: Router) { }

  username = computed(() => this.auth.currentUsername());

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}