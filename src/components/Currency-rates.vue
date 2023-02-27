<script lang="ts">
import { getMoney } from '@/API/getData';
import type { Rates } from '@/types/ratesType';
import { defineComponent, type PropType } from 'vue';
import { checkingOfDigitsAfterComa } from '../helpers/checkingOfDigitsAfterComa'
import AddCurrency from './add-currency.vue';
import PopUp from './pop-up.vue';

interface State {
  selectedCurrency: string,
  defaultCurrencies: string[],
  defaultCurrenciesRates: string[],
  canUpdateRates: boolean,
  areRatesLoading: boolean
  isAddCurrencyVisible: boolean;
  errorMessage: string;
}

export default defineComponent({
  components: { AddCurrency, PopUp },

  props: {
    rates: {
      type: Object as PropType<Rates | null>,
      required: true,
    }
  },

  emits: ["updateRates"],

  data(): State {
    return {
      selectedCurrency: "USD",
      defaultCurrencies: ["USD", "EUR", "UAH"],
      defaultCurrenciesRates: ["USD", "EUR", "UAH", "BTC", "ETH"],
      canUpdateRates: true,
      areRatesLoading: false,
      isAddCurrencyVisible: false,
      errorMessage: '',
    };
  },

  methods: {
    getConvertedPrice(price: number) {
      if (this.rates) {
        const rateOfCurrency = price / +this.rates[this.selectedCurrency];
        return checkingOfDigitsAfterComa(rateOfCurrency);
      }
    },

    async updateRates() {
      this.canUpdateRates = false;

      try {
        this.areRatesLoading = true;
        const newRatesFromServer = await getMoney();
        this.$emit("updateRates", newRatesFromServer);
      }
      catch (err) {
        this.$emit("updateRates", this.rates);
        this.showError('An error has sprung, cannot update rates');
      }

      setTimeout(() => this.canUpdateRates = true, 5000);
      this.areRatesLoading = false;
    },

    updateDefaultCurrencies(newCurrency: string) {
      this.defaultCurrenciesRates = [
        ...this.defaultCurrenciesRates,
        newCurrency,
      ];

      const newListOfCurrencies = [
        ...JSON.parse(
          localStorage.getItem('currencyRateToShow') || '[]'
        ),
        newCurrency,
      ]

      localStorage.setItem(
        'currencyRateToShow',
        JSON.stringify(newListOfCurrencies),
      );
    },

    showError(message: string) {
      this.errorMessage = message;
    }
  },

  mounted() {
    this.defaultCurrenciesRates = [
      ...this.defaultCurrenciesRates,
      ...JSON.parse(localStorage.getItem('currencyRateToShow') || '[]'),
    ];
  },

  computed: {
    currenciesNamesArr() {
      const allCurrenciesNames: string[] = [];

      for (const nameOfCurrency in this.rates) {
        allCurrenciesNames.push(nameOfCurrency);
      }

      return allCurrenciesNames.sort((a, b) => a.localeCompare(b));
    },
  },
})
</script>

<template>
  <h1 class="title">Currency rates</h1>
  
  <div class="form">
    <form>
      <label for="from_currency" class="form__label">
        currency:
      </label>

      <select
        v-model="selectedCurrency"
        id="from_currency"
        name="from_currency"
        class="form__selector"
      >
        <option 
          v-for="name in defaultCurrencies" 
          :key="name" 
          :selected="name === selectedCurrency"
        >
          {{ name }}
        </option>
      </select>

      <div class="flex-container">
        <button 
          class="button"
          @click.prevent="updateRates" 
          :disabled="!canUpdateRates"
        >
          <template v-if="!areRatesLoading">
            update
          </template>

          <img 
            v-else 
            src="../../public/loaders/Loader.svg" 
            alt="loader"
            class="loader"
          >
        </button>

        <button 
          class="button"
          @click.prevent="() => isAddCurrencyVisible = true"
        >
          add
        </button>
      </div>

      <table class="table">
        <tr class="table__row">
          <th class="table__head">Currency Name</th>
          <th class="table__head">The rate in the selected currency</th>
        </tr>

        <template v-for="currency in defaultCurrenciesRates" :key="currency">
          <tr class="table__row" v-if="currency !== selectedCurrency">
            <td class="table__colum">{{ currency }}</td>
            <td class="table__colum">{{ rates ? getConvertedPrice(+rates[currency]) : 'error' }}</td>
          </tr>
        </template>
      </table>
    </form>
  </div>

  <AddCurrency
    v-if="isAddCurrencyVisible"
    :added-currencies="defaultCurrenciesRates" 
    :available-currencies="currenciesNamesArr"
    @add-currency="updateDefaultCurrencies"
    @hide-component="isAddCurrencyVisible = false"
  />

  <PopUp
    v-if="errorMessage"
    :message="errorMessage" 
    @hide-pop-up="() => errorMessage = ''"
  />
</template>