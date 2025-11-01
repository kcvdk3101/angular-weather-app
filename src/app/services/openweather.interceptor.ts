import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const openWeatherInterceptor: HttpInterceptorFn = (req, next) => {
  const { apiKey } = environment.openWeather;

  // Only attach key to OpenWeather requests
  if (req.url.includes('api.openweathermap.org')) {
    const newParams = req.params.set('appid', apiKey);
    const cloned = req.clone({ params: newParams });
    return next(cloned);
  }

  return next(req);
};