<template>
  <span>
    {{
      $t({
        key: 'hello',
        parameters: { name: 'test' },
        defaultValue: 'Default',
        noWrap: false,
      })
    }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TolgeeMixin } from '../TolgeeMixin';

export default defineComponent({
  mixins: [TolgeeMixin],
  name: 'MixinComponent',
});
</script>
