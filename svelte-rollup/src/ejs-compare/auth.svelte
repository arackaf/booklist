<script>
  export let data;
</script>

<div id="riotbar-account-bar">
  {#if data.player.avatarUrl}
    <img class="riotbar-summoner-icon" src={data.player.avatarUrl} alt="x">
  {/if}
  <div class="riotbar-summoner-info">
    <div class="riotbar-summoner-name">{data.player.summonerName}</div>
    <div class="riotbar-summoner-region">{data.player.region}</div>
  </div>
  <div class="riotbar-account-arrow"></div>
</div>

<div id="riotbar-account-dropdown">
  <div class="riotbar-account-info">
    <div id="riotbar-account-dropdown-plugins"></div>
    <div class="riotbar-summoner-info">
      <div class="riotbar-summoner-name">{data.player.summonerName}</div>
      <div class="riotbar-summoner-region">{data.player.region}</div>
    </div>
  </div>

  <div id="riotbar-account-dropdown-links">
  </div>
</div>
