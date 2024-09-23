<template>
  <div class="background-wrapper">
    <div class="example">
      <Navbar>
        <div>
          <a href="/translation-methods">
            <T keyName="menu-item-translation-methods" />
          </a>
        </div>
      </Navbar>

      <header>
        <img src="/img/appLogo.svg" />
        <h1 class="header__title">
          <T keyName="app-title" />
        </h1>
      </header>
      <section class="items">
        <form class="items__new-item" @submit.prevent="onAdd">
          <input
            v-model="newItemValue"
            :placeholder="
              $t({
                key: 'add-item-input-placeholder',
              })
            "
          />
          <button type="submit" :disabled="!newItemValue" class="button">
            <img src="/img/iconAdd.svg" />
            <T keyName="add-item-add-button" />
          </button>
        </form>
        <div class="items__list">
          <div v-for="(item, i) in items" :key="i" class="item">
            <div class="item__text">{{ item }}</div>
            <button @click="onDelete(i)">
              <T keyName="delete-item-button" />
            </button>
          </div>
        </div>
        <div class="items__buttons">
          <button class="button" @click="onAction('share')">
            <img src="/img/iconShare.svg" />
            <T keyName="share-button" />
          </button>
          <button class="button button--secondary" @click="onAction('email')">
            <img src="/img/iconMail.svg" />
            <T keyName="send-via-email" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { T } from '@tolgee/vue';

import Navbar from './Navbar.vue';
import { onMounted } from 'vue';

export default defineComponent({
  components: { T, Navbar },
  name: 'TodosComponent',
  setup() {
    const newItemValue = ref('');
    let items = ref<string[]>([]);

    onMounted(() => {
      let result = [];
      try {
        result = JSON.parse(
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
      items.value = result.length
        ? result
        : ['Passport', 'Maps and directions', 'Travel guide'];
    });

    return { newItemValue, items };
  },
  methods: {
    onAdd() {
      if (this.newItemValue) {
        this.items.push(this.newItemValue);
        this.updateLocalStorage();
        this.newItemValue = '';
      }
    },
    onDelete(index: number) {
      this.items = this.items.filter((_, i) => i !== index);
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      localStorage.setItem(
        'tolgee-example-app-items',
        JSON.stringify(this.items)
      );
    },
    onAction(action: string) {
      alert('action: ' + action);
    },
  },
});
</script>
