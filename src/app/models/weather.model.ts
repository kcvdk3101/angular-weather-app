export interface WeatherSummary {
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  dt: number;
  temp: number;
  feels_like?: number;
  humidity?: number;
  pressure?: number;
  wind_speed?: number;
  wind_deg?: number;
  sunrise?: number;
  sunset?: number;
  weather: WeatherSummary[];
}

export interface ForecastDay {
  dt: number;
  temp: { day: number; min: number; max: number };
  weather: WeatherSummary[];
}

export interface CityWeather {
  id: number;
  name: string;
  country?: string;
  current: CurrentWeather;
}

export interface MockWeatherFile {
  cities: CityWeather[];
}