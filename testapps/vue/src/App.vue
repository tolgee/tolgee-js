<!--
<template>
  <TolgeeProvider :config="config">
    <Todos />
    <template v-slot:fallback>
      <div>Loading...</div>
    </template>
  </TolgeeProvider>
</template>
-->

<script lang="tsx">
/* eslint-disable @typescript-eslint/no-var-requires */
import { defineComponent } from 'vue';
import { TolgeeProvider } from '@tolgee/vue';

import Todos from './components/Todos.vue';

export default defineComponent({
  name: 'App',
  components: { TolgeeProvider, Todos },
  data() {
    return {
      config: {
        apiUrl: process.env.VUE_APP_TOLGEE_API_URL,
        apiKey: process.env.VUE_APP_TOLGEE_API_KEY,
        ui: process.env.VUE_APP_TOLGEE_API_KEY
          ? require('@tolgee/ui').UI
          : undefined,
      },
    };
  },
  render() {
    return (
      <TolgeeProvider
        config={this.config}
        loadingFallback={<div>Loading ...</div>}
      >
        <Todos />
      </TolgeeProvider>
    );
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 300px;
  margin: 60px auto;
  color: #2c3e50;
}
</style>
