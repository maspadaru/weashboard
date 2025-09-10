<script setup lang="ts">
import { watch } from "vue";
import { useWeather } from "../composables/useWeather";
import type { CurrentWeather } from "../types/CurrentWeather";

const props = defineProps<{
  cityName: string;
}>();

const { weatherData, loading, error, fetchWeatherByCity } = useWeather();

watch(
  () => props.cityName,
  (newCity: string) => {
    if (newCity?.trim()) {
      fetchWeatherByCity(newCity?.trim());
    }
  },
  { immediate: true } // also run on first render
);
</script>

<template>
  <p>City {{ cityName }}</p>
  <p v-if="loading">Loading...</p>
  <p v-else-if="error">Error: {{ error }}</p>
  <template v-else-if="weatherData">
    <p>Temperature: {{ weatherData.temperature }}</p>
    <p>Wind Speed: {{ weatherData.windSpeed }}</p>
  </template>
</template>
