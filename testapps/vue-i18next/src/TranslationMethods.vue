<template>
  <main class="translation-methods">
    <Navbar>
      <div>
        <a href="/">The example app</a>
      </div>
    </Navbar>

    <div class="tiles">
      <div>
        <h1>t function without default</h1>
        <div>{{ $t('this_is_a_key') }}</div>
      </div>

      <div>
        <h1>t function with params</h1>
        <div>
          {{
            $t('this_is_a_key_with_params', { key: 'value', key2: 'value2' })
          }}
        </div>
      </div>

      <div>
        <h1>t function with default</h1>
        <div>{{ $t('this_key_does_not_exist', 'This is default') }}</div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Navbar from './components/Navbar.vue';

export default {
  components: { Navbar },
};
</script>
