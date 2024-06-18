<template>
  <main class="translation-methods">
    <Navbar>
      <div>
        <a href="/">The example app</a>
      </div>
    </Navbar>

    <div class="tiles">
      <div>
        <h1>T component with Slots syntax</h1>
        <div>
          {{ $t('this_is_a_key') }}
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import Navbar from './components/Navbar.vue';
</script>
