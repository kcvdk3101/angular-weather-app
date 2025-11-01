export interface OWCurrentResponse {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  wind: { speed: number; deg: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  name: string;
}

export interface OWForecastResponse {
  list: {
    dt: number;
    main: { temp: number };
    weather: { id: number; main: string; description: string; icon: string }[];
  }[];
  city: { name: string; country: string };
}