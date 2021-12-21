<template>
  <div class="navbar">
    <slot />
    <LangSelector />
  </div>
</template>

<script>
import LangSelector from './LangSelector.vue';

export default {
  components: { LangSelector },
};
</script>
