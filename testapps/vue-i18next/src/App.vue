<template>
  <div v-waitForT>
    <template v-if="currentRoute === '/'">
      <Todos />
    </template>
    <template v-else>
      <TranslationMethods />
    </template>
  </div>
</template>

<script lang="ts">
import Todos from './Todos.vue';
import TranslationMethods from './TranslationMethods.vue';

export default {
  name: 'App',
  components: { Todos, TranslationMethods },
  data() {
    return {
      currentRoute: window.location.pathname,
    };
  },
};
</script>
