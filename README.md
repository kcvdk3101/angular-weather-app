# Angular Weather App

A simple application that displays current weather data and basic metrics for searched cities. Users must sign up / log in (mock client‑side JWT) before accessing the dashboard. Favorites are stored per authenticated user.

## Project Structure

```
src/
  app/
    app.component.*              Root component
    app.routes.ts                Route definitions (protected + public)
    app.config.ts                Global providers (router, http, forms, interceptors)

    components/
      login/                     Login form UI
      signup/                    Registration form UI
      current-weather-card/      Displays current weather + favorite toggle
      weather-metrics/           Shows metrics (sunrise, sunset, pressure...)
      favorites/                 Favorites list per user
      city-detail/               City route wrapper
      weather-search/            Search & display city weather

    services/
      auth.service.ts            Client-side users + JWT mock logic
      favorites.service.ts       Per-user favorites (city names)
      weather.service.ts         Fetch + map API or mock file

    guards/
      auth.guard.ts              Route protection / token refresh

    interceptors/
      auth.interceptor.ts        Attaches Authorization header

    models/
      weather.model.ts           App weather data model
      openweather-api.model.ts   OpenWeather response subsets
      user.model.ts              User + JWT payload models

    utils/
      jwt.util.ts                Sign/verify mock JWT (HS256)
      password.util.ts           Salted SHA-256 hashing (demo only)
```

## Quick Start

1. Install dependencies:

```bash
  npm install
```

2. Provide an OpenWeather API key in `src/environments/environment.ts`.
3. Run dev server:

```bash
  ng serve
```

4. Open http://localhost:4200
5. Sign up a new account (or use demo credentials if already created).
6. Search for a city (e.g. "Ho Chi Minh", "Ha Noi").

## Scripts

| Command                                | Purpose                                            |
| -------------------------------------- | -------------------------------------------------- |
| `ng serve`                             | Start dev server                                   |
| `ng test`                              | Run unit tests (adjust to new services/components) |
| `ng build`                             | Production build (ensure keys properly injected)   |
| `ng build --configuration development` | Development build with source maps                 |
