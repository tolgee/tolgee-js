<template>
  <div class="background-wrapper">
    <div class="example">
      <Navbar>
        <div>
          <a href="/translation-methods">
            <T
              keyName="menu-item-translation-methods"
              defaultValue="Translation methods"
            />
          </a>
        </div>
      </Navbar>

      <header>
        <h1 class="header__title">
          <T keyName="on-the-road-title" defaultValue="On the road" />
        </h1>
        <h2 class="header__subtitle">
          <T
            keyName="on-the-road-subtitle"
            defaultValue="what to pack for the trip"
          />
        </h2>
      </header>
      <section class="items">
        <div class="items__new-item">
          <input
            v-model="newItemValue"
            :placeholder="
              $t({
                key: 'add-item-input-placeholder',
                defaultValue: 'New list item',
              })
            "
          />
          <button @click="onAdd" :disabled="!newItemValue" class="button">
            <T keyName="add-item-add-button" defaultValue="Add" />
          </button>
        </div>
        <div class="items__list">
          <div v-for="(item, i) in items" :key="i" class="item">
            <div class="item__text">{{ item }}</div>
            <button @click="onDelete(i)">
              <T keyName="delete-item-button" defaultValue="Delete" />
            </button>
          </div>
        </div>
        <div class="items__buttons">
          <button class="button" @click="onAction('share')">
            <T keyName="share-button" defaultValue="Share" />
          </button>
          <button class="button button--secondary" @click="onAction('email')">
            <T keyName="send-via-email" defaultValue="Send via e-mail" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue';
import { T } from '@tolgee/vue';

import Navbar from './components/Navbar.vue';

export default defineComponent({
  components: { T, Navbar },
  name: 'TodosComponent',
  data() {
    let items: string[] | undefined = undefined;
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
    onAdd(e: Event) {
      e.preventDefault();
      if (this.$data.newItemValue) {
        this.$data.items.push(this.$data.newItemValue);
        this.updateLocalStorage();
        this.$data.newItemValue = '';
      }
    },
    onDelete(index: number) {
      this.$data.items = this.$data.items.filter((_, i) => i !== index);
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
