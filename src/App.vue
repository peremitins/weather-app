<template>
  <div id="app" class="main">
    <Navigation></Navigation>
    <router-view :cities="cities"/>
  </div>
</template>

<script>
import Navigation from './components/Navigation';
import axios from 'axios';
import db from './firebase/firebaseInit';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore/lite';

export default {
  components: { Navigation },
  name: 'App',
  data() {
    return {
      APIkey: '152307cfee4000c6853a3faf8d9bc911',
      city: 'Detroit',
      cities: []
    }
  },
  created() {
    this.getCityWeather();
  },
  methods: {
    async getCityWeather() {
      const citiesCol = collection(db, 'cities');
      
      const citySnapshot = await getDocs(citiesCol);
      citySnapshot.docs.map(async city => {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.data().city}&appid=${this.APIkey}`);
          const getCityById = doc(db, "cities", city.id);
          await updateDoc(getCityById, {
              currentWeather: response.data
          })
          this.cities.push(city.data());
        } catch (err) {
          console.log(err);
        }
      });
    },
    async getApi() {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.APIkey}`);
      console.log(response);
      
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}
.day {
  transition: 500ms ease all;
  background-color: rgb(59, 150, 249);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.night {
  transition: 500ms ease all;
  background-color: rgb(20, 42, 95);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.main {
  max-width: 1024px;
  margin: 0 auto;
  height: 100vh;

}
.container {
  padding: 0 20px;
}
.loading {
  @keyframes spin {
    to {
      transform: rotateZ(360deg);
    }
  }
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  span {
    display: block;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 2px solid transparent;
    border-top-color: #142a5f;
    border-radius: 50%;
    animation: spin ease 1000ms infinite;
  }
}
</style>
