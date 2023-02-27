<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BlurBlock from './Blur-block.vue';

interface State {
  selectedCurrency: string,
}

export default defineComponent({
  components: { BlurBlock },

  name: 'addCurrency',

  props: {
    availableCurrencies: {
      type: Array as PropType<string[]>,
      required: true,
    },

    addedCurrencies: {
      type: Array as PropType<string[]>,
      required: true,
    }
  },

  emits: ["addCurrency", "hideComponent"],

  data(): State {
    return {
      selectedCurrency: "",
    };
  },
  
  methods: {
    updateCurrenciesList() {
      if (this.selectedCurrency) {
        this.$emit("addCurrency", this.selectedCurrency);
      }

      this.selectedCurrency = "";
      this.$emit('hideComponent');
    },
  },
})
</script>

<template>
  <BlurBlock />

  <div class="form pop-up">
    <form>
      <label for="from_currency" class="form__label">
        Currencies:
      </label>

      <select 
        id="from_currency"
        v-model="selectedCurrency"
        name="from_currency"
        class="form__selector"
      >
        <option value="" disabled>choose currency to add</option>

        <template v-for="name in availableCurrencies" :key="name">
          <option 
            :selected="name === selectedCurrency"
            v-if="!addedCurrencies.includes(name)"
          >
            {{ name }}
          </option>
        </template>
      </select>

      <div class="flex-container flex-container--between">
        <button class="button" @click.prevent="updateCurrenciesList">
          add to list
        </button>

        <button 
          class="button" 
          @click.prevent="() => $emit('hideComponent')"
        >
          close
        </button>
      </div>
    </form>
  </div>
</template>