<template>
  <div class="main">
    <div v-if="loading" class="loading">
      <span></span>
    </div>
    <div v-else class="weather" :class="{ day: isDay, night: isNight }">
      <div class="weather-wrap">
        <CurrentWeather :isDay="isDay" :isNight="isNight" :currentWeather="currentWeather" />
        <HourlyWeather :forecast="forecast" />
        <WeeklyForecast :forecast="forecast" />
        <AdditionalInfo :currentWeather="currentWeather" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import db from '../firebase/firebaseInit';
import { collection, getDocs, query, where } from "firebase/firestore";

export default {
  name: 'Weather',
  props: ['APIkey'],
  data() {
    return {
      forecast: null,
      currentWeather: null,
      loading: true,
      currentTime: null,
    }
  },
  created() {
    this.getWeather();
  },
  beforeDestroy() {
    this.$emit('resetDays');
  },
  methods: {
    async getWeather() {
      const q = query(collection(db, "cities"), where("city", "==", `${this.$route.params.city}`));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (city) => {
        this.currentWeather = city.data().currentWeather;
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.data().currentWeather.coord.lat}&lon=${city.data().currentWeather.coord.lon}&exclude=current,minutley,alerts&units=metric&appid=${this.APIkey}`)
        this.forecast = await response.data;
        this.loading = false;
        this.getCurrentTime();
      });
    },
    getCurrentTime() {
      const dateObject = new Date();
      this.currentTime = dateObject.getHours();
      const sunrise = new Date(this.currentWeather.sys.sunrise * 1000).getHours();
      const sunset = new Date(this.currentWeather.sys.sunset * 1000).getHours();
      if (this.currentTime > sunrise && this.currentTime < sunset) {
        this.$emit('is-day');
      } else {
        this.$emit('is-night');
      }
    }
  }
}
</script>

<style lang="scss">
.weather {
  transition: 500ms ease;
  overflow: scroll;
  width: 100%;
  height: 100%;

  .weather-wrap {
    overflow: hidden;
    max-width: 1024px;
    margin: 0 auto;
  }
}
</style>