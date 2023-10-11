<template>
  <div class="background-wrapper">
    <div class="example">
      <Navbar>
        <div>
          <a href="/translation-methods">
            {{ $t('menu-item-translation-methods') }}
          </a>
        </div>
      </Navbar>

      <header>
        <img src="/img/appLogo.svg" />
        <h1 class="header__title">
          {{ $t('app-title') }}
        </h1>
      </header>
      <section class="items">
        <form class="items__new-item" @submit.prevent="onAdd">
          <input
            v-model="newItemValue"
            :placeholder="$t('add-item-input-placeholder')"
          />
          <button type="submit" :disabled="!newItemValue" class="button">
            <img src="/img/iconAdd.svg" />
            {{ $t('add-item-add-button') }}
          </button>
        </form>
        <div class="items__list">
          <div v-for="(item, i) in items" :key="i" class="item">
            <div class="item__text">{{ item }}</div>
            <button @click="onDelete(i)">
              {{ $t('delete-item-button') }}
            </button>
          </div>
        </div>
        <div class="items__buttons">
          <button class="button" @click="onAction('share')">
            <img src="/img/iconShare.svg" />
            {{ $t('share-button') }}
          </button>
          <button class="button button--secondary" @click="onAction('email')">
            <img src="/img/iconMail.svg" />
            {{ $t('send-via-email') }}
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
        : ['Passport', 'Maps and directions', 'Travel guide'],
    };
  },
  methods: {
    onAdd() {
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
