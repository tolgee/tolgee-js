<script>
  import { getTranslate } from '@tolgee/svelte';
  import Navbar from '../../component/Navbar.svelte';

  const { t, isLoading } = getTranslate(['base', 'test1', 'test2', 'test3']);
</script>

<main class="translation-methods">
  <Navbar>
    <div slot="menu-items">
      <a href="/">The example app</a>
    </div>
  </Navbar>

  <div>
    {#if $isLoading}
      Loading namespace
    {:else}
      {$t('test')}
      {$t('test', { ns: 'test1'})}
      {$t('test', { ns: 'test2'})}
      {$t('test', { ns: 'test3'})}
    {/if}
  </div>
</main>
