<script>
  import { getLanguageStore } from '$lib/getLanguageStore';

  export let instanceRef = { changeLanguage: null };

  instanceRef.changeLanguage = getLanguageStore().set;
</script>
