import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  // Signals for loading state and error message
  loading = signal(false);
  error = signal<string | null>(null);

  // Form typed
  form = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4)]
    }),
    remember: new FormControl<boolean>(false, { nonNullable: true })
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async submit() {
    this.error.set(null);

    if (this.form.invalid) {
      this.error.set('Please enter valid information.');
      return;
    }

    this.loading.set(true);
    const { username, password } = this.form.value as {
      username: string;
      password: string;
      remember: boolean;
    };

    try {
      const result = await this.authService.login(username, password);
      this.loading.set(false);

      if (!result.success) {
        this.error.set(result.error || 'Login failed.');
        return;
      }

      // Get returnUrl if available (e.g., redirected by guard)
      const returnUrl =
        this.route.snapshot.queryParamMap.get('returnUrl') || '/';
      this.router.navigateByUrl(returnUrl);
    } catch (e: any) {
      this.loading.set(false);
      this.error.set(e?.message || 'An error occurred.');
    }
  }
}