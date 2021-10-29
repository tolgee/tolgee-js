<template>
  <div class="footer">
    <T keyName="sampleApp.this_is_standard_text_somewhere_in_dom" />
  </div>
</template>

<script lang="ts">
import { T } from '@tolgee/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { T },
  name: 'Footer',
});
</script>

<style>
.footer {
  margin-top: 100px;
}
</style>
