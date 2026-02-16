<script lang="ts">
  let data = $state<any>(null);
  async function testPscaleHttp() {
    const response = await fetch("/api/test-pscale-http");
    const json = await response.json();
    data = json;
  }
</script>

<div class="flex flex-col items-start gap-3 p-4">
  <div>Hello World</div>
  <button class="border p-2 rounded" onclick={testPscaleHttp}>Load Data</button>

  <pre>{JSON.stringify(data, null, 2)}</pre>
</div>
