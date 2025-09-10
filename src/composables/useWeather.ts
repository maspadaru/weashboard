import { ref } from "vue";
import type { Ref } from "vue";
import type { CurrentWeather } from "../types/CurrentWeather";

type Coordinates = { lat: number; lon: number };

async function getCoordinates(city: string): Promise<Coordinates> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Geocoding error: HTTP ${res.status} - ${res.statusText}`);
  }
  if (data.results && data.results.length > 0) {
    return { lat: data.results[0].latitude, lon: data.results[0].longitude };
  } else {
    throw new Error("City not found");
  }
}

async function getWeather(lat: number, lon: number): Promise<CurrentWeather> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`
  );
  if (!res.ok) {
    throw new Error(`Forecast error: HTTP ${res.status} - ${res.statusText}`);
  }
  const data = await res.json();
  if (
    !data.current ||
    typeof data.current.temperature_2m !== "number" ||
    typeof data.current.wind_speed_10m !== "number"
  ) {
    throw new Error("Unexpected weather data format");
  }
  return {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
  };
}

export function useWeather(): {
  weatherData: Ref<CurrentWeather | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  fetchWeatherByCity: (city: string) => Promise<void>;
} {
  const weatherData = ref<CurrentWeather | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWeatherByCity(city: string) {
    loading.value = true;
    error.value = null;
    weatherData.value = null;

    try {
      const coordinates = await getCoordinates(city);
      weatherData.value = await getWeather(coordinates.lat, coordinates.lon);
    } catch (err: any) {
      error.value = err.message || "Unknown error";
    } finally {
      loading.value = false;
    }
  }

  return { weatherData, loading, error, fetchWeatherByCity };
}
