<template>
  <div v-if="tolgeeContext">
    {{ tolgeeContext.tolgee.getLanguage() }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  inject: ['tolgeeContext'],
});
</script>
