export const environment = {
  production: false,
  openWeather: {
    apiKey: 'OPEN_WEATHER_API_KEY',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    units: 'metric',
    lang: 'en'
  },
  useMock: false,
  auth: {
    jwtSecret: 'DEV_SUPER_SECRET_KEY_CHANGE_ME',
    accessTokenTtlSeconds: 900,
    refreshGraceSeconds: 300
  }
};