<script>
  import LangSelector from "./LangSelector.svelte";
</script>

<div class="navbar">
  <slot name="menu-items"/>
  <LangSelector />
</div>
