<script>
  export let data;
</script>

<ul class="utility-links">
  {#each data.utilityLinks as link}
    <li
      class={'link-' + link.id}
      data-ping-meta={'riotbar-content=account|riotbar-accountAction=' + link.id}>
      <a href={link.url} title={link.text}> {link.text}</a>
    </li>
  {/each}
</ul>
