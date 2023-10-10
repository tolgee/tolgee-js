<script lang="ts">
  import { T, getTranslate } from '@tolgee/svelte';
  import Navbar from '../component/Navbar.svelte';

  const { t } = getTranslate();

  const getInitialItems = () => {
    let items: string[] | undefined = undefined;
    try {
      items = JSON.parse(localStorage.getItem('tolgee-example-app-items') || '');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(
        'Something went wrong while parsing stored items. Items are reset.'
      );
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('tolgee-example-app-items');
      }
    }
    return items?.length
      ? items
      : ['Passport', 'Maps and directions', 'Travel guide'];
  };

  let items = getInitialItems();
  let newItemValue: string;

  const onAdd = () => {
    if (newItemValue) {
      items = [...items, newItemValue];
      updateLocalStorage();
      newItemValue = '';
    }
  };

  const updateLocalStorage = () =>
    localStorage.setItem('tolgee-example-app-items', JSON.stringify(items));

  const onDelete = (index: number) => {
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
          <T keyName="menu-item-translation-methods"/>
        </a>
      </div>
    </Navbar>

    <header>
      <img src="/img/appLogo.svg" alt="App logo"/>
      <h1 class="header__title">
        <T keyName="app-title"/>
      </h1>
    </header>
    <section class="items">
      <form class="items__new-item" on:submit|preventDefault={onAdd}>
        <input
          bind:value={newItemValue}
          placeholder={$t({ key: 'add-item-input-placeholder', })}
        />
        <button type="submit" disabled={!newItemValue} class="button">
          <img src="/img/iconAdd.svg" alt="Add" />
          <T keyName="add-item-add-button"/>
        </button>
      </form>
      <div class="items__list">
        {#each items as item, index}
          <div class="item">
            <div class="item__text">{item}</div>
            <button on:click={() => onDelete(index)}>
              <T keyName="delete-item-button"/>
            </button>
          </div>
        {/each}
      </div>
      <div class="items__buttons">
        <button class="button" on:click={onAction('share')}>
          <img src="/img/iconShare.svg" alt="Share" />
          <T keyName="share-button" />
        </button>
        <button class="button button--secondary" on:click={onAction('email')}>
          <img src="/img/iconMail.svg" alt="Send" />
          <T keyName="send-via-email"/>
        </button>
      </div>
    </section>
  </div>
</div>
