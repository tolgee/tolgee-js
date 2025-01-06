<script lang="ts">
  import { getTranslate } from '$lib/index';
  const { isLoading, t } = getTranslate('test');
</script>

<div>
  {#if $isLoading}
    <div data-testid="loading">Loading...</div>
  {/if}
  <div data-testid="test">{$t('test')}</div>
  <div data-testid="test_english_fallback">
    {$t('test_english_fallback')}
  </div>
  <div data-testid="non_existant">
    {$t('non_existant', 'Non existant')}
  </div>
  <div data-testid="ns_fallback">
    {$t('fallback', { ns: 'invalid' })}
  </div>
</div>
