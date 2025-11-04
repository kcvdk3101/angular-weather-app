import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('api.openweathermap.org')) {
    return next(req);
  }

  const auth = inject(AuthService);
  const header = auth.getAuthHeader();
  if (header) {
    const clone = req.clone({ setHeaders: { Authorization: header } });
    return next(clone);
  }
  return next(req);
};