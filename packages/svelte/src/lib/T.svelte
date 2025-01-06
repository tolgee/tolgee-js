<script lang="ts">
  import type { NsType, TranslationKey } from '@tolgee/web';
  import getTranslateInternal from './getTranslateInternal';

  export let keyName: TranslationKey;
  export let params: Record<string, unknown> | undefined = undefined;
  export let noWrap = false;
  export let defaultValue: string | undefined = undefined;
  export let ns: NsType = undefined;
  export let language: string = undefined;

  if (!keyName) {
    console.error('Missing keyName prop!');
  }

  const { t } = getTranslateInternal();
</script>

{$t({
  key: keyName,
  params: params,
  noWrap: noWrap,
  defaultValue: defaultValue,
  ns,
  language
})}
