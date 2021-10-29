<script lang="ts">
  import getTolgeeContext from "./getTolgeeContext";
  import { onDestroy } from "svelte";

  export let keyName: string;
  export let parameters: Record<string, any> | undefined = undefined;
  export let strategy: "ELEMENT_WRAP" | "TEXT_WRAP" | "NO_WRAP" =
    "ELEMENT_WRAP";

  if (!keyName) {
    console.error("Missing keyName prop!");
    // show the error in the DOM
    keyName = "Tolgee: Missing key name prop!";
    strategy = "NO_WRAP";
  }

  const translationFnNoWrap =
    strategy === "NO_WRAP" || strategy === "ELEMENT_WRAP";
  const tolgeeContext = getTolgeeContext();


  let translated = tolgeeContext.tolgee.instant(
    keyName,
    parameters,
    translationFnNoWrap,
    true
  );

  let spanWrapperRef: Element;

  const translate = () =>
    tolgeeContext.tolgee
      .translate(
        keyName,
        parameters,
        translationFnNoWrap,
        spanWrapperRef?.textContent || undefined
      )
      .then((result) => {
        translated = result;
      })
      .catch(() => {
        console.error("Failed to resolve translation for key: ", keyName);
      });

  translate();

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

  if (typeof window !== "undefined") {
    onDestroy(() => {
      onTranslationChangeSubscription.unsubscribe();
      onLangChangeSubscription.unsubscribe();
    });
  }

  $: (spanWrapperRef && spanWrapperRef.textContent) && translate();
</script>

{#if strategy === 'ELEMENT_WRAP'}
  <span data-tolgee-key-only={keyName} bind:this={spanWrapperRef}>
    {#if !translated}
      {#if $$slots.default}
        <slot />
      {:else}
        {keyName}
      {/if}
    {:else}
      {translated}
    {/if}
  </span>
{:else if !translated}
  {#if $$slots.default}
    <slot />
  {:else}
    {keyName}
  {/if}
{:else}
  {translated}
{/if}
