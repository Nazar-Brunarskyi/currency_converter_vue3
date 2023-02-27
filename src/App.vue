<script lang="ts">
import { defineComponent } from 'vue';
import { getMoney } from './API/getData'
import CurrencyRates from './components/Currency-rates.vue'
import CurrencyConverter from './components/Currency-converter.vue'
import type { Rates } from './types/ratesType'

interface State {
  rates: Rates | null;
}

export default defineComponent({
  components: {
    CurrencyRates,
    CurrencyConverter,
},

  data(): State { 
    return {
      rates: null,
    };
  },

  async mounted() {
    const fiveHours = 18000000;
    const lastLoading = JSON.parse(localStorage.getItem('lastLoading') || '0');
    const shouldBeLoadedAgain = new Date().getTime() - lastLoading > fiveHours;

    let cachedExchangeRates = JSON.parse(localStorage.getItem('exchangeRates') || 'null')

    if (!cachedExchangeRates || shouldBeLoadedAgain) {
      const ratesFromServer = await getMoney();
      
      localStorage.setItem('exchangeRates', JSON.stringify(ratesFromServer))

      cachedExchangeRates = ratesFromServer;

      localStorage.setItem('lastLoading', JSON.stringify(new Date().getTime()))
    }

    this.rates = cachedExchangeRates
  },

  methods: {
    updateRates(newRates: Rates) {
      this.rates = newRates;
      localStorage.setItem('exchangeRates', JSON.stringify(newRates))
    }
  },
});
</script>

<template>
  <template v-if="rates">
    <CurrencyConverter :rates="rates"/>

    <CurrencyRates
      :rates="rates"
      @update-rates="updateRates"
    />
  </template>

  <img
    v-else
    src="../public/loaders/Loader-blue.svg" 
    alt="loader" 
    class="loader loader-main"
  >
</template>