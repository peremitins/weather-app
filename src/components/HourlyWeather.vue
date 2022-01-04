<template>
  <div class="hourly-weather" ref="hourlyWeather" @mousewheel.prevent="scrollX">
    <div class="container">
      <div class="hourly-temp" v-for="(time, index) in filteredList" :key="index">
        <HourlyTemp :time="time" />
      </div>
    </div>
  </div>
</template>

<script>
import HourlyTemp from "./HourlyTemp";
export default {
  name: "HourlyWeather",
  props: ["forecast"],
  components: {
    HourlyTemp,
  },
  computed: {
    filteredList() {
      return this.forecast.hourly.slice(1, 25);
    },
  },
  methods: {
    scrollX(e) {
      this.$refs.hourlyWeather.scrollLeft += e.deltaY;
    }
  }
};
</script>

<style lang="scss" scoped>
.hourly-weather {
  padding: 30px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  overflow-x: scroll;
  .container {
    display: flex;
    max-width: 100vw;
    padding: 0;
    margin: 0 20px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
