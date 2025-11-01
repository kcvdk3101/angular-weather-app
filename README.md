# Angular Weather App

Simple Angular Weather App

## Quick start

1. Clone your repo:

```bash
  git clone kcvdk3101/angular-weather-app.git
```

2. Install deps:

```bash
  npm install
```

3. To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

4. Search using the top input (try "Paris" or "New York").

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

## OpenWeatherMap Integration

To enable real data:

1. Put your API key into `src/environments/environment.ts` (development) and update the production environment.
2. Set `useMock: false` (already default). To temporarily revert to mock data, set `useMock: true`.
3. If using the interceptor (`openweather.interceptor.ts`), you DO NOT need to add `appid` manually in service calls; remove it from `WeatherService` parameters.
4. Commands:
   - Development: `ng serve`
   - Production build: `ng build --configuration production` (ensure prod env key is set or replaced in CI).
5. If you want to avoid committing keys, inject them via CI and replace a placeholder string using a build step (sed or a custom script).
