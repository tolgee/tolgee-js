<template>
  <div class="navbar">
    <slot />
    <LangSelector />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import LangSelector from './LangSelector.vue';

export default defineComponent({
  components: { LangSelector },
});
</script>
