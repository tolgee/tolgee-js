<script>
  import { TolgeeProvider } from "../index";
</script>

<TolgeeProvider config={{}}>
  <div slot="loading-fallback">Custom loading fallback</div>
  <div slot="default">
    Default slot
  </div>
</TolgeeProvider>
