<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Rates } from '../types/ratesType';
import { checkingOfDigitsAfterComa } from '../helpers/checkingOfDigitsAfterComa';
import PopUp from './pop-up.vue';

interface State {
  currentRateOfCurrencyToConvert: number,
  currentRateOfConvertedCurrency: number,
  currencyToConvert: string,
  convertedCurrency: string,
  amountOfCurrencyToConvert: number,
  amountOfConvertedCurrency: number,
  conversionLimit: number,
  errorMessage: string;
}

export default defineComponent({
  components: { PopUp },

  props: {
    rates: {
      type: Object as PropType<Rates | null>,
      required: true,
    }
  },

  data(): State { 
    return {
      currencyToConvert: 'USD',
      convertedCurrency: 'BTC',
      currentRateOfCurrencyToConvert: 0,
      currentRateOfConvertedCurrency : 0,
      amountOfCurrencyToConvert: 0,
      amountOfConvertedCurrency: 0,
      conversionLimit: 10000,
      errorMessage: '',
    };
  },

  mounted() {
    if (this.rates) {
      this.currentRateOfCurrencyToConvert = +this.rates[this.currencyToConvert]
      this.currentRateOfConvertedCurrency = +this.rates[this.convertedCurrency]
    }
  },

  watch: {
    currencyToConvert() {
      if (this.rates) {
        this.currentRateOfCurrencyToConvert = +this.rates[this.currencyToConvert]
        this.amountOfConvertedCurrency = checkingOfDigitsAfterComa(this.newAmountConvertedCurrency);
        const incomingInput = this.$refs['incoming__currency'] as HTMLLIElement;
        incomingInput.focus();

        if (this.isLimitReached) {
          this.setTheBiggestAmount();
        }
      }
    },

    convertedCurrency() {
      if (this.rates) {
        this.currentRateOfConvertedCurrency = +this.rates[this.convertedCurrency]
        this.amountOfConvertedCurrency = checkingOfDigitsAfterComa(this.newAmountConvertedCurrency);
        const outcomingInput = this.$refs['outcoming__currency'] as HTMLLIElement;
        outcomingInput.focus();

        if (this.isLimitReached) {
          this.setTheBiggestAmount();
        }
      }
    },

    amountOfCurrencyToConvert() {
      if (!this.rates){
        return;
      }
      
      if (this.isLimitReached) {
        this.setTheBiggestAmount();

        this.showError('you can\'t convert an amount bigger than 10 000$, the max amount will be set automatically');
        return;
      }

      if (this.$refs['outcoming__currency'] !== document.activeElement) {
        this.amountOfConvertedCurrency = checkingOfDigitsAfterComa(this.newAmountConvertedCurrency);
      }
    },

    amountOfConvertedCurrency() {
      if (this.$refs['incoming__currency'] !== document.activeElement) {
        this.amountOfCurrencyToConvert = checkingOfDigitsAfterComa(this.newAmountOfConvertedCurrency);
      }
    },
  },

  computed: {
    currenciesNamesArr() {
      const allCurrenciesNames: string[] = [];

      for (const nameOfCurrency in this.rates) {
        allCurrenciesNames.push(nameOfCurrency);
      }

      return allCurrenciesNames.sort((a, b) => a.localeCompare(b));
    },

    newAmountConvertedCurrency() {
      return this.amountOfCurrencyToConvert
        / this.currentRateOfCurrencyToConvert
        * this.currentRateOfConvertedCurrency;
    },

    newAmountOfConvertedCurrency() {
      return this.amountOfConvertedCurrency
        / (this.currentRateOfConvertedCurrency / this.currentRateOfCurrencyToConvert);
    },

    isLimitReached() {
      if (this.rates) {
        return this.amountOfCurrencyToConvert
          / +this.rates[this.currencyToConvert] > this.conversionLimit;
      }

      return false;
    },
  },

  methods: {
    setTheBiggestAmount() {
      if (this.rates) {
        this.amountOfCurrencyToConvert = +(this.conversionLimit * +this.rates[this.currencyToConvert])
          .toFixed(2);

        this.amountOfConvertedCurrency = +(this.conversionLimit * +this.rates[this.convertedCurrency])
          .toFixed(2);
      }
    },

    showError(message: string) {
      this.errorMessage = message;
    },
  }
});
</script>

<template>
    <h1 class="title">Currency converter</h1>

    <div class="form">
      <form>
        <label for="from_currency" class="form__label">
          currency to conversion:
        </label>

        <select 
          id="from_currency" 
          name="from_currency"
          class="form__selector"
          v-model="currencyToConvert"
        >
          <option 
            v-for="name in currenciesNamesArr" 
            :key="name"
            :value="name"
            :selected="name === 'USD'"
          >
          {{ name }}
          </option>
        </select>

        <label for="to_currency" class="form__label">
          converted currency:
        </label>

        <select 
          id="to_currency" 
          name="to_currency" 
          class="form__selector"
          v-model="convertedCurrency"
        >
          <option 
            v-for="name in currenciesNamesArr" 
            :key="name"
            :value="name"
            :selected="name === 'BTC'"
          >
          {{ name }}
          </option>
        </select>

        <label 
          for="from_amount"
          class="form__label"
        >
          Amount of incoming currency:
        </label>

        <input 
          ref="incoming__currency"
          type="number" 
          class="form__input"
          id="from_amount" 
          name="from_amount" 
          min="0"
          step="0.1"
          v-model="amountOfCurrencyToConvert"
          required
        >
        
        <label 
          for="to_amount"
          class="form__label"
        >
          Amount of converted currency:
        </label>

        <input 
          ref="outcoming__currency"
          type="number"
          class="form__input"
          id="to_amount"
          name="to_amount"
          min="0"
          step="0.01"
          v-model="amountOfConvertedCurrency"
          required
        >
      </form>
    </div>
    
    <PopUp 
      v-if="errorMessage"
      :message="errorMessage"
      @hide-pop-up="() => errorMessage = ''"
    />
</template>