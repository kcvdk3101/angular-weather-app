import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const ok = await auth.refreshIfNeeded();
  if (ok) return true;
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};