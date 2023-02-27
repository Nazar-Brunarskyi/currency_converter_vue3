<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import BlurBlock from './Blur-block.vue';

export default defineComponent({
  components: { BlurBlock },

  name: "popUp",

  props: {
    message: {
      type: String as PropType<string>,
      required: true,
    }
  },

  emits: ["hidePopUp"],
})
</script>

<template>
  <BlurBlock />

  <div class="form pop-up">
    <p class="pop-up__message">
      {{ message }}
    </p>

    <button 
      class="button pop-up__button"
      @click.prevent="() => $emit('hidePopUp')"
    >
      close
    </button>
  </div>
</template>