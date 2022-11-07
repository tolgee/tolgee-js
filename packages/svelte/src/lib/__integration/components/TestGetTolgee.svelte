<script lang="ts">
  import { getTolgee } from "$lib/getTolgee";
  import type { TolgeeEvent } from "@tolgee/web";

  export let events: TolgeeEvent[] = []
  const tolgee = getTolgee(events)
</script>

<div>
  <div data-testid="language">{String($tolgee.getLanguage())}</div>
  <div data-testid="pendingLanguage">{String($tolgee.getPendingLanguage())}</div>
  <div data-testid="fetching">{String($tolgee.isFetching())}</div>
  <div data-testid="loading">{String($tolgee.isLoading())}</div>
  <div data-testid="initialLoad">{String($tolgee.isInitialLoading())}</div>
  <div data-testid="running">{String($tolgee.isRunning())}</div>
</div>

