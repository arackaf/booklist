<script lang="ts">
	import '$styles/site-styles.scss';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import './styles.scss';
</script>

<h1>Welcome to SvelteKit</h1>
<h2>
	{$page.data.searchProps}
</h2>

<a href="/?val=A">1</a>
<a href="/?val=B">2</a>
<a href="/?val=C">3</a>

<button on:click={() => history.pushState({}, '', '/?val=X')}>Client side 1</button>
<button on:click={() => history.pushState({}, '', '/?val=Y')}>Client side 2</button>
<button on:click={() => history.pushState({}, '', '/?val=Z')}>Client side 3</button>

<div class="x">
	Hi there
	<span style="color: var(--danger-3)">Hello world</span>
</div>

<form method="POST" use:enhance>
	<button>Run mutation</button>
</form>
