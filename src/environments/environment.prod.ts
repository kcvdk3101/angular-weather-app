export const environment = {
  production: true,
  openWeather: {
    apiKey: 'OPEN_WEATHER_API_KEY',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    units: 'metric',
    lang: 'en'
  },
  useMock: false,
  auth: {
    jwtSecret: 'PROD_SECRET_SHOULD_NOT_BE_IN_FRONTEND',
    accessTokenTtlSeconds: 900,
    refreshGraceSeconds: 300
  }
};