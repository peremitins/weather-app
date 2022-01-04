<template>
  <div id="app" class="main">
    <Modal 
      v-if="modalOpen" 
      @close-modal="toggleModal" 
      :APIkey="APIkey" 
      :cities="cities"
    ></Modal>
    <Navigation 
      @add-city="toggleModal" 
      @edit-city="toggleEdit" 
      :addCityActive="addCityActive" 
      :isDay="isDay" 
      :isNight="isNight"
    ></Navigation>
    <router-view 
      :cities="cities" 
      :edit="edit" 
      :APIkey="APIkey" 
      @is-day="dayTime" 
      @is-night="nightTime"
      @resetDays="resetDays"
    />
  </div>
</template>

<script>
import db from './firebase/firebaseInit';
import { doc, updateDoc, collection,  onSnapshot } from 'firebase/firestore';
import Modal from './components/Modal'
import Navigation from './components/Navigation';
import axios from 'axios';

export default {
  components: {
    Modal, Navigation },
  name: 'App',
  data() {
    return {
      isDay: null,
      isNight: null,
      APIkey: '152307cfee4000c6853a3faf8d9bc911',
      city: 'Detroit',
      cities: [],
      modalOpen: null,
      edit: null,
      addCityActive: null,
    }
  },
  created() {
    this.getCityWeather();
    this.checkRoute();
  },
  methods: {
    async getCityWeather() {
      const citiesCol = collection(db, 'cities');
      
        onSnapshot(citiesCol, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added" && !change.doc.Nd) {
             try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${change.doc.data().city}&units=metric&appid=${this.APIkey}`);
                const getCityById = doc(db, "cities", change.doc.id);
                await updateDoc(getCityById, {
                    currentWeather: response.data
                })
                this.cities.push(change.doc.data());
              } catch (err) {
                console.log(err);
              }
            } else if (change.type === "added" && change.doc.Nd) {
              this.cities.push(change.doc.data())
            } else if (change.type === "removed") {
              this.cities = this.cities.filter(city => city.city !== change.doc.data().city)
            }
          });
        });
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    toggleEdit() {
      this.edit = !this.edit;
    },
    checkRoute() {
      if (this.$route.name === 'AddCity') {
        this.addCityActive = true;
      } else {
        this.addCityActive =false;
      }
    },
    dayTime() {
      this.isDay = !this.isDay;
    },
    nightTime() {
      this.isNight = !this.isNight;
    },
    resetDays() {
      this.isDay = false;
      this.isNight = false;
    }
  },
  watch: {
    $route() {
      this.checkRoute();
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
