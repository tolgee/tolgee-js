<script lang="ts">
  import getTranslateInternal from './getTranslateInternal';

  export let keyName: string;
  export let params: Record<string, unknown> | undefined = undefined;
  export let noWrap = false;
  export let defaultValue = undefined;

  if (!keyName) {
    console.error('Missing keyName prop!');
  }

  const { t } = getTranslateInternal()
</script>

{$t({
  key: keyName,
  params: params,
  noWrap: noWrap,
  defaultValue: defaultValue
})}
