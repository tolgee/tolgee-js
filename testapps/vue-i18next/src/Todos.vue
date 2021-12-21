<template>
  <div class="background-wrapper">
    <div class="example">
      <Navbar>
        <div>
          <a href="/translation-methods">
            {{ $t('menu-item-translation-methods', 'Translation methods') }}
          </a>
        </div>
      </Navbar>

      <header>
        <h1 class="header__title">
          {{ $t('on-the-road-title', 'On the road') }}
        </h1>
        <h2 class="header__subtitle">
          {{ $t('on-the-road-subtitle', 'what to pack for the trip') }}
        </h2>
      </header>
      <section class="items">
        <div class="items__new-item">
          <input
            v-model="newItemValue"
            :placeholder="$t('add-item-input-placeholder', 'New list item')"
          />
          <button @click="onAdd" :disabled="!newItemValue" class="button">
            {{ $t('add-item-add-button', 'Add') }}
          </button>
        </div>
        <div class="items__list">
          <div v-for="(item, i) in items" :key="i" class="item">
            <div class="item__text">{{ item }}</div>
            <button @click="onDelete(i)">
              {{ $t('delete-item-button', 'Delete') }}
            </button>
          </div>
        </div>
        <div class="items__buttons">
          <button class="button" @click="onAction('share')">
            {{ $t('share-button', 'Share') }}
          </button>
          <button class="button button--secondary" @click="onAction('email')">
            {{ $t('send-via-email', 'Send via e-mail') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  components: { Navbar },
  name: 'Todos',
  data() {
    let items = undefined;
    try {
      items = JSON.parse(
        localStorage.getItem('tolgee-example-app-items') || ''
      );
    } catch (e) {
      console.error(
        'Something went wrong while parsing stored items. Items are reset.'
      );
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('tolgee-example-app-items');
      }
    }
    return {
      newItemValue: '',
      items: items?.length
        ? items
        : ['Flame-thrower', 'Horse', 'My favourite toothbrush'],
    };
  },
  methods: {
    onAdd(e) {
      e.preventDefault();
      if (this.$data.newItemValue) {
        this.$data.items.push(this.$data.newItemValue);
        this.updateLocalStorage();
        this.$data.newItemValue = '';
      }
    },
    onDelete(index) {
      this.$data.items = this.$data.items.filter((_, i) => i !== index);
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      localStorage.setItem(
        'tolgee-example-app-items',
        JSON.stringify(this.items)
      );
    },
    onAction(action) {
      alert('action: ' + action);
    },
  },
};
</script>
