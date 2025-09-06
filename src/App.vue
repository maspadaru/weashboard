<script setup lang="ts">
import { ref } from "vue";
import SearchBar from "./components/SearchBar.vue";
import WeatherCard from "./components/WeatherCard.vue";
const cityName = ref("");
</script>

<template>
  <SearchBar @cityName="(msg: string) => cityName = msg" />
  <p>Displaying weather for {{ cityName }}:</p>
  <WeatherCard :cityName="cityName"/>
</template>
