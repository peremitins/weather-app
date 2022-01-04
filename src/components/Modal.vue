<template>
  <div @click="closeModal" class="modal" ref="modal">
    <form @submit.prevent="addCity" class="modal__wrap" ref="modalWrap">
      <label for="modal__city-name">Enter Location:</label>
      <input ref="email" type="text" name="city-name" placeholder="Search By City Name" v-model="city" />
      <button>Add</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import {  collection, addDoc } from 'firebase/firestore';
import db from '../firebase/firebaseInit';

export default {
  name: "modal",
  props: ["APIkey", "cities"],
  data() {
    return {
      city: "",
    };
  },
  mounted() {
    this.focusInput();
  },
  methods: {
    closeModal(e) {
      if (e.target === this.$refs.modal) {
        this.$emit("close-modal");
      }
    },
    focusInput() {
      this.$refs.email.focus();
    },
    async addCity() {
      if (this.city === "") {
        alert("field cannot be empty");
      } else if (this.cities.some((res) => res.city === this.city.toLowerCase())) {
        alert(`${this.city} already exists!`);
      } else {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.APIkey}`);
  
          await addDoc(collection(db, "cities"), {
            city: this.city,
            currentWeather: response.data
          });
          this.$emit("close-modal");
        } catch {
          alert(`${this.city} does not exist, please try again!`);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  z-index: 101;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  label {
    color: #fff;
  }

  &__wrap {
    max-width: 500px;
    border-radius: 8px;
    width: 80%;
    padding: 20px;
    background-color: #31363d;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

    input {
      color: #fff;
      border: none;
      background-color: transparent;
      border-bottom: 1px solid #fff;
      padding: 6px 4px;
      margin: 10px 0 20px;
      width: 100%;

      &:focus {
        outline: none;
      }
    }

    button {
      background-color: #222325;
      color: #fff;
      padding: 6px 20px;
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>
