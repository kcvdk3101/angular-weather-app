# Angular Weather App

A simple application that displays current weather data and basic metrics for searched cities. Users must sign up / log in (mock client‑side JWT) before accessing the dashboard. Favorites are stored per authenticated user.

## Project Structure

```
angular-weather-app/
  README.md
  karma.conf.js
  package.json
  tsconfig.json
  .github/
    workflows/
      pages-deploy.yml          # GitHub Pages deploy workflow

  src/
    index.html
    main.ts
    styles.scss
    favicon.ico

    environments/
      environment.ts            # Dev config (useMock, API key placeholder)
      environment.prod.ts       # Prod config (placeholder replaced in CI)

    assets/
      mock-weather.json         # Mock dataset (when useMock = true)

    app/
      app.component.*           # Root shell (header, router-outlet)
      app.routes.ts             # Route definitions (public + guarded)
      app.config.ts             # Global providers (router, http, interceptors, forms)

      models/
        weather.model.ts        # App-level weather models
        openweather-api.model.ts# Subset of OpenWeather responses
        user.model.ts           # User + JWT payload types

      services/
        auth.service.ts         # Client-side signup/login + mock JWT
        favorites.service.ts    # Per-user favorites (stored by city name)
        weather.service.ts      # Fetch & map current weather (API or mock)

      guards/
        auth.guard.ts           # CanActivateFn guard (token refresh / access control)

      interceptors/
        auth.interceptor.ts     # Skips OpenWeather; adds Authorization for /api/*
        openweather.interceptor.ts # Optionally attaches appid to OW requests (if used)

      utils/
        jwt.util.ts              # Sign/verify mock HS256 JWT
        password.util.ts         # Salted SHA-256 hashing demo

      components/
        login/
          login.component.(ts|html|scss|spec.ts)
        signup/
          signup.component.(ts|html|scss|spec.ts)
        weather-search/
          weather-search.(ts|html|scss|spec.ts)
        current-weather-card/
          current-weather-card.(ts|html|scss|spec.ts)
        weather-metrics/
          weather-metrics.(ts|html|scss|spec.ts)
        favorites/
          favorites.component.(ts|html|scss|spec.ts)
        city-detail/
          city-detail.(ts|html|scss|spec.ts)

    404.html (generated in CI)  # SPA deep-link fallback (copied from index.html)
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
| `ng test --no-watch --code-coverage`   | Run test coverage                                  |
| `ng build`                             | Production build (ensure keys properly injected)   |
| `ng build --configuration development` | Development build with source maps                 |

## Testing

Run all test & coverage:

```bash
  npm run test:cvr
```

Coverage report (HTML) in `coverage/index.html`. Global purpose: ≥ 80%.

## Deploy to GitHub Pages

This project uses GitHub Actions workflow (.github/workflows/pages-deploy.yml) to build and deploy Angular 20 app as a project site.

### Production Build

Base href must match the repository path:

```bash
ng build --configuration production --base-href /angular-weather-app/
```

### SPA Routing

Copy `index.html` to `404.html` after build so direct deep-link refresh works.

### Manual Local Preview

```bash
npx http-server dist/angular-weather-app/browser -p 8080
# Open http://localhost:8080/angular-weather-app/
```
