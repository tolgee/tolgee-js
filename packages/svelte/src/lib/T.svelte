<script lang="ts">
  import getTolgeeContext from './getTolgeeContext';
  import { onDestroy } from 'svelte';

  export let keyName: string;
  export let parameters: Record<string, any> | undefined = undefined;
  export let noWrap: boolean = false;
  export let defaultValue = undefined;

  if (!keyName) {
    console.error('Missing keyName prop!');
  }

  const tolgeeContext = getTolgeeContext();

  let translated = keyName
    ? tolgeeContext.tolgee.instant(keyName, parameters, noWrap, true)
    : '';

  const translate = () => {
    if (keyName) {
      tolgeeContext.tolgee
        .translate({
          key: keyName,
          params: parameters,
          noWrap,
          defaultValue,
        })
        .then((result) => {
          translated = result;
        })
        .catch(() => {
          console.error('Failed to resolve translation for key: ', keyName);
        });
    }
  };

  const onTranslationChangeSubscription =
    tolgeeContext.tolgee.onTranslationChange.subscribe((changeData) => {
      if (changeData.key === keyName) {
        translate();
      }
    });

  const onLangChangeSubscription = tolgeeContext.tolgee.onLangChange.subscribe(
    () => {
      translate();
    }
  );

  if (typeof window !== 'undefined') {
    onDestroy(() => {
      onTranslationChangeSubscription.unsubscribe();
      onLangChangeSubscription.unsubscribe();
    });
  }

  $: translate();
</script>

{translated}
