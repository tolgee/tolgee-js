<script lang="ts">
    import type { NsType } from '@tolgee/web';
  import getTranslateInternal from './getTranslateInternal';

  export let keyName: string;
  export let params: Record<string, unknown> | undefined = undefined;
  export let noWrap = false;
  export let defaultValue = undefined;
  export let ns: NsType = undefined

  if (!keyName) {
    console.error('Missing keyName prop!');
  }

  const { t } = getTranslateInternal()
</script>

{$t({
  key: keyName,
  params: params,
  noWrap: noWrap,
  defaultValue: defaultValue,
  ns,
})}
