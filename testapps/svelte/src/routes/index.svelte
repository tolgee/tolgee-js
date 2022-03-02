<script lang="ts">
  import { T, getTranslate } from '@tolgee/svelte';
  import Navbar from '../component/Navbar.svelte';

  const t = getTranslate();

  let items: string[] = [];
  let newItemValue: string;
  try {
    items = JSON.parse(localStorage.getItem('tolgee-example-app-items')) || [
      'Flame-thrower',
      'Horse',
      'My favourite toothbrush'
    ];
  } catch (e) {
    // when local storage is not set due to SSR, don't pring any error
    if (typeof localStorage !== 'undefined') {
      console.error('Something went wrong while parsing stored items. Items are reset.');
      localStorage.removeItem('tolgee-example-app-items');
    }
  }
  const onAdd = () => {
    if (newItemValue) {
      items = [...items, newItemValue];
      updateLocalStorage();
      newItemValue = '';
    }
  };

  const updateLocalStorage = () =>
    localStorage.setItem('tolgee-example-app-items', JSON.stringify(items));

  const onDelete = (index) => {
    items.splice(index, 1);
    items = [...items];
    updateLocalStorage();
  };

  const onAction = (action: string) => () => {
    alert('action: ' + action);
  };
</script>

<div class="background-wrapper">
  <div class="example">
    <Navbar>
      <div slot="menu-items">
        <a href="/translation-methods">
          <T keyName="menu-item-translation-methods" defaultValue="Translation methods" />
        </a>
      </div>
    </Navbar>

    <header>
      <h1 class="header__title">
        <T keyName="on-the-road-title" defaultValue="On the road" />
      </h1>
      <h2 class="header__subtitle">
        <T keyName="on-the-road-subtitle" defaultValue="what to pack for the trip" />
      </h2>
    </header>
    <section class="items">
      <div class="items__new-item">
        <input
          bind:value={newItemValue}
          placeholder={$t({ key: 'add-item-input-placeholder', defaultValue: 'New list item' })}
        />
        <button on:click={onAdd} disabled={!newItemValue} class="button">
          <T keyName="add-item-add-button" defaultValue="Add" />
        </button>
      </div>
      <div class="items__list">
        {#each items as item, index}
          <div class="item">
            <div class="item__text">{item}</div>
            <button on:click={() => onDelete(index)}>
              <T keyName="delete-item-button" defaultValue="Delete" />
            </button>
          </div>
        {/each}
      </div>
      <div class="items__buttons">
        <button class="button" on:click={onAction('share')}>
          <T keyName="share-button" defaultValue="Share" />
        </button>
        <button class="button button--secondary" on:click={onAction('email')}>
          <T keyName="send-via-email" defaultValue="Send via e-mail" />
        </button>
      </div>
    </section>
  </div>
</div>
