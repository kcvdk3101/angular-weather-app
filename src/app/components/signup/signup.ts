import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  form = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    confirm: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  async submit() {
    this.error.set(null);
    this.success.set(false);
    if (this.form.invalid) {
      this.error.set('Please enter valid information.');
      return;
    }
    const { username, password, confirm } = this.form.value as { username: string; password: string; confirm: string };
    if (password !== confirm) {
      this.error.set('Password confirmation does not match.');
      return;
    }
    this.loading.set(true);
    const res = await this.auth.signup(username, password);
    this.loading.set(false);
    if (!res.success) {
      this.error.set(res.error || 'Signup failed.');
      return;
    }
    this.success.set(true);
    // Auto login after signup
    const loginRes = await this.auth.login(username, password);
    if (loginRes.success) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
      this.router.navigateByUrl(returnUrl);
    }
  }
}